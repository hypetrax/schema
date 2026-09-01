import { NextResponse } from 'next/server';
import { SPORTHALLEN, TEAM_NAME, getMatchId } from '@/lib/data';

export async function GET() {
  try {
    const res = await fetch('https://motia.nl/elo/schema.html', {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) BV Hardenberg Schedule App'
      }
    });

    if (!res.ok) {
      return NextResponse.json({ success: false, error: 'Kon motia.nl niet bereiken' }, { status: 502 });
    }

    const html = await res.text();
    const trRegex = /<TR>[\s\S]*?<\/TR>/gi;
    const trMatches = html.match(trRegex) || [];

    const matches = [];

    for (const tr of trMatches) {
      const tdRegex = /<TD>[\s\S]*?<\/TD>/gi;
      const tds = (tr.match(tdRegex) || []).map(td => td.replace(/<[^>]+>/g, '').trim());

      if (tds.length >= 6) {
        const date = tds[0];
        const day = tds[1];
        const time = tds[2];
        const home = tds[3];
        const away = tds[5];

        const isHardenberg = home === TEAM_NAME || away === TEAM_NAME;
        const isHome = home === TEAM_NAME;
        const homeHall = SPORTHALLEN[home];
        const locationName = homeHall ? `${homeHall.name} (${homeHall.city})` : `${home} Hal`;
        const address = homeHall ? `${homeHall.address}, ${homeHall.city}` : home;
        const mapsUrl = homeHall ? homeHall.mapsUrl : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(home)}`;

        matches.push({
          id: getMatchId({ date, home, away }),
          date,
          day,
          time,
          home,
          away,
          isHardenberg,
          isHome,
          location: locationName,
          address,
          googleMapsUrl: mapsUrl
        });
      }
    }

    return NextResponse.json({
      success: true,
      count: matches.length,
      hardenbergCount: matches.filter(m => m.isHardenberg).length,
      matches,
      fetchedAt: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Scrape fout' }, { status: 500 });
  }
}
