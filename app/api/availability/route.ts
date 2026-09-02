import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Redis from 'ioredis';
import { verifyCredentials } from '@/lib/auth';
import { PlayerName } from '@/lib/types';

// Force Vercel serverless to never cache this API route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DATA_FILE = path.join(process.cwd(), 'availability-store.json');
const REDIS_KEY = 'bv_hardenberg_availability_data';

const REDIS_URL = process.env.REDIS_URL || 'redis://default:fKsWlpFByyCsfKhpiygZNnWd7ccOWB13@stop-camera-cats-17284.db.redis.io:17123';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
};

// Handle OPTIONS preflight requests for CORS
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Singleton Redis Client for serverless environments
let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (!redis && REDIS_URL) {
    try {
      redis = new Redis(REDIS_URL, {
        maxRetriesPerRequest: 3,
        connectTimeout: 5000,
        enableOfflineQueue: true
      });
      redis.on('error', (err) => console.log('Redis client error:', err.message));
    } catch (e) {
      console.log('Redis creation error:', e);
    }
  }
  return redis;
}

let localMemoryStore: Record<string, any> = {};

// Load disk fallback if available
try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    localMemoryStore = JSON.parse(raw);
  }
} catch (e) {}

async function fetchLatestData(): Promise<{ data: Record<string, any>; redisActive: boolean }> {
  const r = getRedis();
  if (r) {
    try {
      const raw = await r.get(REDIS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          // Merge local disk fallback into memory
          localMemoryStore = { ...localMemoryStore, ...parsed };
          return { data: localMemoryStore, redisActive: true };
        }
      }
      return { data: localMemoryStore, redisActive: true };
    } catch (err) {
      console.log('Error fetching from Redis:', err);
    }
  }
  return { data: localMemoryStore, redisActive: false };
}

async function persistData(data: Record<string, any>): Promise<boolean> {
  localMemoryStore = data;
  let redisSuccess = false;

  const r = getRedis();
  if (r) {
    try {
      await r.set(REDIS_KEY, JSON.stringify(data));
      redisSuccess = true;
    } catch (err) {
      console.log('Error saving to Redis:', err);
    }
  }

  // Backup write to local disk
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {}

  return redisSuccess;
}

export async function GET() {
  const { data, redisActive } = await fetchLatestData();
  return NextResponse.json({
    success: true,
    data,
    redisActive,
    updatedAt: new Date().toISOString()
  }, {
    headers: corsHeaders
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { matchId, player, status, password, driver, wash, notes, fullData } = body;

    // Fetch freshest state from Redis DB before applying changes
    const { data: currentStore } = await fetchLatestData();

    if (fullData && typeof fullData === 'object') {
      const merged = { ...currentStore, ...fullData };
      const saved = await persistData(merged);
      return NextResponse.json({ success: true, data: merged, redisActive: saved }, { headers: corsHeaders });
    }

    if (!matchId) {
      return NextResponse.json({ success: false, error: 'matchId is verplicht' }, { status: 400, headers: corsHeaders });
    }

    // Authenticate player status change
    if (player && status) {
      if (!password || !verifyCredentials(player as PlayerName, password)) {
        return NextResponse.json({
          success: false,
          error: `Ongeldig wachtwoord voor ${player}. Je kunt alleen je eigen aanwezigheid aanpassen met jouw inlog.`
        }, { status: 403, headers: corsHeaders });
      }

      if (!currentStore[matchId]) {
        currentStore[matchId] = { players: {}, extra: {} };
      }
      if (!currentStore[matchId].players) {
        currentStore[matchId].players = {};
      }

      // Granular update for specific player
      currentStore[matchId].players[player] = status;
    }

    // Extra details update (driver, wash, notes)
    if (driver !== undefined || wash !== undefined || notes !== undefined) {
      if (!currentStore[matchId]) {
        currentStore[matchId] = { players: {}, extra: {} };
      }
      if (!currentStore[matchId].extra) {
        currentStore[matchId].extra = {};
      }
      if (driver !== undefined) currentStore[matchId].extra.driver = driver;
      if (wash !== undefined) currentStore[matchId].extra.wash = wash;
      if (notes !== undefined) currentStore[matchId].extra.notes = notes;
    }

    const saved = await persistData(currentStore);

    return NextResponse.json({
      success: true,
      data: currentStore,
      redisActive: saved,
      updatedMatch: currentStore[matchId]
    }, {
      headers: corsHeaders
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Fout bij opslaan' }, { status: 500, headers: corsHeaders });
  }
}
