import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Redis from 'ioredis';
import { verifyCredentials } from '@/lib/auth';
import { PlayerName } from '@/lib/types';

const DATA_FILE = path.join(process.cwd(), 'availability-store.json');
const REDIS_KEY = 'bv_hardenberg_availability_data';

// Default Redis connection URL (or environment variable if set on Vercel)
const DEFAULT_REDIS_URL = process.env.REDIS_URL || 'redis://default:fKsWlpFByyCsfKhpiygZNnWd7ccOWB13@stop-camera-cats-17284.db.redis.io:17123';

let redisClient: Redis | null = null;

function getRedisClient(): Redis | null {
  if (redisClient) return redisClient;
  try {
    if (DEFAULT_REDIS_URL) {
      redisClient = new Redis(DEFAULT_REDIS_URL, {
        maxRetriesPerRequest: 3,
        connectTimeout: 5000,
        lazyConnect: true
      });
    }
  } catch (e) {
    console.log('Failed to create Redis client:', e);
  }
  return redisClient;
}

let localMemoryStore: Record<string, any> = {};

// Initial disk load fallback
try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    localMemoryStore = JSON.parse(raw);
  }
} catch (e) {}

async function getStoredData(): Promise<{ data: Record<string, any>; redisActive: boolean }> {
  const client = getRedisClient();
  if (client) {
    try {
      if (client.status === 'wait') {
        await client.connect();
      }
      const raw = await client.get(REDIS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          localMemoryStore = { ...localMemoryStore, ...parsed };
          return { data: localMemoryStore, redisActive: true };
        }
      }
      return { data: localMemoryStore, redisActive: true };
    } catch (e) {
      console.log('Error reading from Redis DB:', e);
    }
  }

  return { data: localMemoryStore, redisActive: false };
}

async function saveStoredData(data: Record<string, any>): Promise<boolean> {
  localMemoryStore = data;
  let redisSaved = false;

  const client = getRedisClient();
  if (client) {
    try {
      if (client.status === 'wait') {
        await client.connect();
      }
      await client.set(REDIS_KEY, JSON.stringify(data));
      redisSaved = true;
    } catch (e) {
      console.log('Error writing to Redis DB:', e);
    }
  }

  // Disk fallback
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {}

  return redisSaved;
}

export async function GET() {
  const { data, redisActive } = await getStoredData();
  return NextResponse.json({
    success: true,
    data,
    redisActive,
    updatedAt: new Date().toISOString()
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { matchId, player, status, password, driver, wash, notes, fullData } = body;

    const { data: currentStore } = await getStoredData();

    if (fullData && typeof fullData === 'object') {
      const merged = { ...currentStore, ...fullData };
      const redisSaved = await saveStoredData(merged);
      return NextResponse.json({ success: true, data: merged, redisActive: redisSaved });
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

      // Granular update preserving other players' status
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

    const redisSaved = await saveStoredData(currentStore);

    return NextResponse.json({
      success: true,
      data: currentStore,
      redisActive: redisSaved,
      updatedMatch: currentStore[matchId]
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Fout bij opslaan' }, { status: 500 });
  }
}
