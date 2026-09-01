import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Redis } from '@upstash/redis';
import { verifyCredentials } from '@/lib/auth';
import { PlayerName } from '@/lib/types';

const DATA_FILE = path.join(process.cwd(), 'availability-store.json');
const REDIS_KEY = 'bv_hardenberg_availability_data';

// Initialize Redis if env vars are provided by Vercel KV / Upstash
let redis: Redis | null = null;
try {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    redis = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN
    });
  } else if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = Redis.fromEnv();
  }
} catch (e) {
  console.log('Redis initialization skipped:', e);
}

let localMemoryStore: Record<string, any> = {};

// Load initial data from disk if present
try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    localMemoryStore = JSON.parse(raw);
  }
} catch (e) {}

async function getStoredData(): Promise<Record<string, any>> {
  if (redis) {
    try {
      const data = await redis.get<Record<string, any>>(REDIS_KEY);
      if (data && typeof data === 'object') {
        localMemoryStore = { ...localMemoryStore, ...data };
        return localMemoryStore;
      }
    } catch (e) {
      console.log('Error reading from Redis:', e);
    }
  }

  // Fallback to disk / memory
  return localMemoryStore;
}

async function saveStoredData(data: Record<string, any>): Promise<void> {
  localMemoryStore = data;

  if (redis) {
    try {
      await redis.set(REDIS_KEY, data);
    } catch (e) {
      console.log('Error saving to Redis:', e);
    }
  }

  // Try writing to disk fallback
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {}
}

export async function GET() {
  const currentData = await getStoredData();
  return NextResponse.json({
    success: true,
    data: currentData,
    redisActive: !!redis,
    updatedAt: new Date().toISOString()
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { matchId, player, status, password, driver, wash, notes, fullData } = body;

    const currentStore = await getStoredData();

    if (fullData && typeof fullData === 'object') {
      const merged = { ...currentStore, ...fullData };
      await saveStoredData(merged);
      return NextResponse.json({ success: true, data: merged });
    }

    if (!matchId) {
      return NextResponse.json({ success: false, error: 'matchId is verplicht' }, { status: 400 });
    }

    // Authenticate player status change
    if (player && status) {
      if (!password || !verifyCredentials(player as PlayerName, password)) {
        return NextResponse.json({
          success: false,
          error: `Ongeldig wachtwoord voor ${player}. Je kunt alleen je eigen aanwezigheid aanpassen met jouw inlog.`
        }, { status: 403 });
      }

      if (!currentStore[matchId]) {
        currentStore[matchId] = { players: {}, extra: {} };
      }
      if (!currentStore[matchId].players) {
        currentStore[matchId].players = {};
      }

      // Granular per-player update (preserves other players' status)
      currentStore[matchId].players[player] = status;
    }

    // Extra details update
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

    await saveStoredData(currentStore);

    return NextResponse.json({
      success: true,
      data: currentStore,
      redisActive: !!redis,
      updatedMatch: currentStore[matchId]
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Fout bij opslaan' }, { status: 500 });
  }
}
