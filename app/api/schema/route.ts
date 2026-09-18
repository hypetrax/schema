import { NextResponse } from 'next/server';
import { SPORTHALLEN, TEAM_NAME, getMatchId, RAW_MATCHES_DATA } from '@/lib/data';

export async function GET() {
  try {
    const res = await fetch('https://motia.nl/elo/schema.html', {
      next: { revalidate: 86400 },
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
        let finalDate = tds[0];
        let finalDay = tds[1];
        let finalTime = tds[2];
        const home = tds[3];
        const away = tds[5];
        
        const manualOverride = RAW_MATCHES_DATA.find(m => m.home === home && m.away === away);
        if (manualOverride) {
          finalDate = manualOverride.date;
          finalDay = manualOverride.day;
          finalTime = manualOverride.time;
        }

        let homeScore = undefined;
        let awayScore = undefined;
        if (tds.length >= 9) {
          homeScore = tds[6];
          awayScore = tds[8];
        }

        const isHardenberg = home === TEAM_NAME || away === TEAM_NAME;
        const isHome = home === TEAM_NAME;
        const homeHall = SPORTHALLEN[home];
        const locationName = homeHall ? `${homeHall.name} (${homeHall.city})` : `${home} Hal`;
        const address = homeHall ? `${homeHall.address}, ${homeHall.city}` : home;
        const mapsUrl = homeHall ? homeHall.mapsUrl : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(home)}`;

        matches.push({
          id: getMatchId({ date: finalDate, home, away }),
          date: finalDate,
          day: finalDay,
          time: finalTime,
          home,
          away,
          homeScore,
          awayScore,
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
