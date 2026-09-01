import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { PLAYER_PASSWORDS, verifyCredentials } from '@/lib/auth';
import { PlayerName } from '@/lib/types';

const DATA_FILE = path.join(process.cwd(), 'availability-store.json');

let memoryStore: Record<string, any> = {};

try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    memoryStore = JSON.parse(raw);
  }
} catch (e) {
  console.log('Using in-memory store fallback:', e);
}

function saveData(data: Record<string, any>) {
  memoryStore = data;
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {}
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: memoryStore,
    updatedAt: new Date().toISOString()
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { matchId, player, status, password, driver, wash, notes, fullData } = body;

    if (fullData && typeof fullData === 'object') {
      memoryStore = { ...memoryStore, ...fullData };
      saveData(memoryStore);
      return NextResponse.json({ success: true, data: memoryStore });
    }

    if (!matchId) {
      return NextResponse.json({ success: false, error: 'matchId is verplicht' }, { status: 400 });
    }

    // Authenticate player if changing player status
    if (player && status) {
      if (!password || !verifyCredentials(player as PlayerName, password)) {
        return NextResponse.json({
          success: false,
          error: `Ongeldig wachtwoord voor ${player}. Je kunt alleen je eigen aanwezigheid aanpassen met jouw inlog.`
        }, { status: 403 });
      }

      if (!memoryStore[matchId]) {
        memoryStore[matchId] = { players: {}, extra: {} };
      }
      if (!memoryStore[matchId].players) {
        memoryStore[matchId].players = {};
      }

      memoryStore[matchId].players[player] = status;
    }

    if (driver !== undefined || wash !== undefined || notes !== undefined) {
      if (!memoryStore[matchId]) {
        memoryStore[matchId] = { players: {}, extra: {} };
      }
      if (!memoryStore[matchId].extra) {
        memoryStore[matchId].extra = {};
      }
      if (driver !== undefined) memoryStore[matchId].extra.driver = driver;
      if (wash !== undefined) memoryStore[matchId].extra.wash = wash;
      if (notes !== undefined) memoryStore[matchId].extra.notes = notes;
    }

    saveData(memoryStore);

    return NextResponse.json({
      success: true,
      data: memoryStore,
      updatedMatch: memoryStore[matchId]
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Fout bij opslaan' }, { status: 500 });
  }
}
