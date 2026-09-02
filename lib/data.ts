import { Match, Sporthal } from './types';

export const TEAM_NAME = 'BV Hardenberg';

export const SPORTHALLEN: Record<string, Sporthal> = {
  'BV Hardenberg': {
    name: 'Sporthal De Beek',
    teams: ['BV Hardenberg'],
    address: 'Hondsdraf 38',
    city: 'Hardenberg',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sporthal+De+Beek+Hondsdraf+38+Hardenberg',
    notes: 'Thuisbasis BV Hardenberg. Koffie & borrel na afloop in de kantine.'
  },
  'BV Borne': {
    name: "Sportcomplex 't Wooldrik",
    teams: ['BV Borne'],
    address: 'Het Wooldrik 1',
    city: 'Borne',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Het+Wooldrik+1+Borne'
  },
  't Pluumke': {
    name: 'Sporthal De Els',
    teams: ["t Pluumke"],
    address: 'Trompstraat 20',
    city: 'Haaksbergen',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sporthal+De+Els+Trompstraat+20+Haaksbergen'
  },
  'Elo H1': {
    name: 'Sporthal Slangenbeek',
    teams: ['Elo H1', 'Elo H2'],
    address: 'Straatsburg 5',
    city: 'Hengelo',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sporthal+Slangenbeek+Straatsburg+5+Hengelo'
  },
  'Elo H2': {
    name: 'Sporthal Slangenbeek',
    teams: ['Elo H1', 'Elo H2'],
    address: 'Straatsburg 5',
    city: 'Hengelo',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sporthal+Slangenbeek+Straatsburg+5+Hengelo'
  },
  'Wik 80': {
    name: 'Pathmoshal',
    teams: ['Wik 80'],
    address: 'Veilingstraat 20',
    city: 'Enschede',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pathmoshal+Veilingstraat+20+Enschede'
  },
  'GV Unisson': {
    name: 'MFA De Zweede',
    teams: ['GV Unisson'],
    address: 'Boekelosestraat 275',
    city: 'Boekelo',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=MFA+De+Zweede+Boekelosestraat+275+Boekelo'
  },
  'BV Twenterand': {
    name: 'Het Punt',
    teams: ['BV Twenterand'],
    address: 'Burgemeester Koetjestraat 2',
    city: 'Vroomshoop',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Het+Punt+Burgemeester+Koetjestraat+2+Vroomshoop'
  }
};

export const RAW_MATCHES_DATA = [
  { date: "14-09-2026", day: "maandag", time: "19:30", home: "BV Borne", away: "BV Hardenberg" },
  { date: "17-09-2026", day: "donderdag", time: "20:00", home: "t Pluumke", away: "BV Twenterand" },
  { date: "18-09-2026", day: "vrijdag", time: "19:30", home: "Elo H2", away: "GV Unisson" },
  { date: "18-09-2026", day: "vrijdag", time: "20:00", home: "Wik 80", away: "Elo H1" },
  { date: "22-09-2026", day: "dinsdag", time: "20:00", home: "BV Hardenberg", away: "GV Unisson" },
  { date: "23-09-2026", day: "woensdag", time: "20:00", home: "BV Twenterand", away: "BV Borne" },
  { date: "25-09-2026", day: "vrijdag", time: "19:30", home: "Elo H1", away: "t Pluumke" },
  { date: "25-09-2026", day: "vrijdag", time: "20:00", home: "Wik 80", away: "Elo H2" },
  { date: "28-09-2026", day: "maandag", time: "19:30", home: "BV Borne", away: "Elo H1" },
  { date: "30-09-2026", day: "woensdag", time: "20:00", home: "BV Twenterand", away: "BV Hardenberg" },
  { date: "01-10-2026", day: "donderdag", time: "20:00", home: "t Pluumke", away: "Wik 80" },
  { date: "06-10-2026", day: "dinsdag", time: "20:00", home: "BV Hardenberg", away: "Elo H2" },
  { date: "08-10-2026", day: "donderdag", time: "20:00", home: "GV Unisson", away: "Wik 80" },
  { date: "08-10-2026", day: "donderdag", time: "20:00", home: "t Pluumke", away: "BV Borne" },
  { date: "09-10-2026", day: "vrijdag", time: "19:30", home: "Elo H1", away: "BV Twenterand" },
  { date: "29-10-2026", day: "donderdag", time: "20:00", home: "t Pluumke", away: "GV Unisson" },
  { date: "30-10-2026", day: "vrijdag", time: "19:30", home: "Elo H1", away: "BV Hardenberg" },
  { date: "03-11-2026", day: "dinsdag", time: "20:00", home: "BV Hardenberg", away: "Wik 80" },
  { date: "05-11-2026", day: "donderdag", time: "20:00", home: "GV Unisson", away: "BV Borne" },
  { date: "06-11-2026", day: "vrijdag", time: "19:30", home: "Elo H2", away: "t Pluumke" },
  { date: "09-11-2026", day: "maandag", time: "19:30", home: "BV Borne", away: "Elo H2" },
  { date: "11-11-2026", day: "woensdag", time: "20:00", home: "BV Twenterand", away: "GV Unisson" },
  { date: "17-11-2026", day: "dinsdag", time: "20:00", home: "BV Hardenberg", away: "t Pluumke" },
  { date: "19-11-2026", day: "donderdag", time: "20:00", home: "GV Unisson", away: "Elo H1" },
  { date: "20-11-2026", day: "vrijdag", time: "19:30", home: "Elo H2", away: "BV Twenterand" },
  { date: "20-11-2026", day: "vrijdag", time: "20:00", home: "Wik 80", away: "BV Borne" },
  { date: "25-11-2026", day: "woensdag", time: "20:00", home: "BV Twenterand", away: "Wik 80" },
  { date: "27-11-2026", day: "vrijdag", time: "19:30", home: "Elo H1", away: "Elo H2" },
  { date: "12-01-2027", day: "dinsdag", time: "20:00", home: "BV Hardenberg", away: "BV Borne" },
  { date: "13-01-2027", day: "woensdag", time: "20:00", home: "BV Twenterand", away: "t Pluumke" },
  { date: "15-01-2027", day: "vrijdag", time: "19:30", home: "Elo H1", away: "Wik 80" },
  { date: "18-01-2027", day: "maandag", time: "19:30", home: "BV Borne", away: "BV Twenterand" },
  { date: "21-01-2027", day: "donderdag", time: "20:00", home: "t Pluumke", away: "Elo H1" },
  { date: "21-01-2027", day: "donderdag", time: "20:00", home: "GV Unisson", away: "BV Hardenberg" },
  { date: "26-01-2027", day: "dinsdag", time: "20:00", home: "BV Hardenberg", away: "BV Twenterand" },
  { date: "28-01-2027", day: "donderdag", time: "20:00", home: "GV Unisson", away: "Elo H2" },
  { date: "29-01-2027", day: "vrijdag", time: "19:30", home: "Elo H1", away: "BV Borne" },
  { date: "03-02-2027", day: "woensdag", time: "20:00", home: "BV Twenterand", away: "Elo H1" },
  { date: "05-02-2027", day: "vrijdag", time: "19:30", home: "Elo H2", away: "BV Hardenberg" },
  { date: "05-02-2027", day: "vrijdag", time: "20:00", home: "Wik 80", away: "GV Unisson" },
  { date: "11-02-2027", day: "donderdag", time: "20:00", home: "GV Unisson", away: "t Pluumke" },
  { date: "12-02-2027", day: "vrijdag", time: "19:30", home: "Elo H2", away: "Wik 80" },
  { date: "16-02-2027", day: "dinsdag", time: "20:00", home: "BV Hardenberg", away: "Elo H1" },
  { date: "01-03-2027", day: "maandag", time: "19:30", home: "BV Borne", away: "GV Unisson" },
  { date: "04-03-2027", day: "donderdag", time: "20:00", home: "t Pluumke", away: "Elo H2" },
  { date: "05-03-2027", day: "vrijdag", time: "20:00", home: "Wik 80", away: "BV Hardenberg" },
  { date: "11-03-2027", day: "donderdag", time: "20:00", home: "GV Unisson", away: "BV Twenterand" },
  { date: "12-03-2027", day: "vrijdag", time: "19:30", home: "Elo H2", away: "BV Borne" },
  { date: "12-03-2027", day: "vrijdag", time: "20:00", home: "Wik 80", away: "t Pluumke" },
  { date: "15-03-2027", day: "maandag", time: "19:30", home: "BV Borne", away: "Wik 80" },
  { date: "17-03-2027", day: "woensdag", time: "20:00", home: "BV Twenterand", away: "Elo H2" },
  { date: "18-03-2027", day: "donderdag", time: "20:00", home: "t Pluumke", away: "BV Hardenberg" },
  { date: "19-03-2027", day: "vrijdag", time: "19:30", home: "Elo H1", away: "GV Unisson" },
  { date: "22-03-2027", day: "maandag", time: "19:30", home: "BV Borne", away: "t Pluumke" },
  { date: "26-03-2027", day: "vrijdag", time: "19:30", home: "Elo H2", away: "Elo H1" },
  { date: "26-03-2027", day: "vrijdag", time: "20:00", home: "Wik 80", away: "BV Twenterand" }
];

export function getMatchId(m: { date: string; home: string; away: string }): string {
  const cleanHome = m.home.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanAway = m.away.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `match-${m.date}-${cleanHome}-${cleanAway}`;
}

export function parseDate(dateStr: string, timeStr: string = '20:00'): Date {
  const parts = dateStr.split('-');
  if (parts.length !== 3) return new Date();
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  
  const [hours, minutes] = timeStr.split(':').map(n => parseInt(n, 10) || 0);
  return new Date(year, month, day, hours, minutes);
}

export function formatMatchDate(dateStr: string): string {
  const [dd, mm, yyyy] = dateStr.split('-');
  const months = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
  const monthIdx = parseInt(mm, 10) - 1;
  return `${dd} ${months[monthIdx] || mm} ${yyyy}`;
}

export const INITIAL_MATCHES: Match[] = RAW_MATCHES_DATA.map(m => {
  const isHardenberg = m.home === TEAM_NAME || m.away === TEAM_NAME;
  const isHome = m.home === TEAM_NAME;
  const homeHall = SPORTHALLEN[m.home];
  const locationName = homeHall ? `${homeHall.name} (${homeHall.city})` : `${m.home} Hal`;
  const address = homeHall ? `${homeHall.address}, ${homeHall.city}` : m.home;
  const mapsUrl = homeHall ? homeHall.mapsUrl : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.home)}`;

  return {
    id: getMatchId(m),
    date: m.date,
    day: m.day,
    time: m.time,
    home: m.home,
    away: m.away,
    isHardenberg,
    isHome,
    location: locationName,
    address,
    googleMapsUrl: mapsUrl
  };
});

export const HARDENBERG_MATCHES = INITIAL_MATCHES.filter(m => m.isHardenberg);

export function generateICalContent(match: Match): string {
  const startDate = parseDate(match.date, match.time);
  const endDate = new Date(startDate.getTime() + 2.5 * 60 * 60 * 1000); // 2.5h duration

  const formatDateToICS = (d: Date) => {
    return d.toISOString().replace(/-|:|\.\d+/g, '');
  };

  const title = match.isHome 
    ? `🏸 Badminton: BV Hardenberg vs ${match.away}` 
    : `🏸 Badminton: ${match.home} vs BV Hardenberg`;

  const description = `Competitiewedstrijd BV Hardenberg\\nTijd: ${match.day} ${match.date} om ${match.time}\\nLocatie: ${match.location}\\nBekijk schema & aanwezigheid: https://schema.bartpullen.nl`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BV Hardenberg//Badminton Schema//NL',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${match.id}@schema.bartpullen.nl`,
    `DTSTAMP:${formatDateToICS(new Date())}`,
    `DTSTART:${formatDateToICS(startDate)}`,
    `DTEND:${formatDateToICS(endDate)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${match.address}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

export function generateWhatsAppMessage(match: Match, availability?: Record<string, string>, extra?: { driver?: string; wash?: string; notes?: string }): string {
  const players = ['Bart', 'Emile', 'Age', 'Harry', 'Ronald'];
  const ja: string[] = [];
  const nee: string[] = [];
  const twijfel: string[] = [];
  const onbekend: string[] = [];

  players.forEach(p => {
    const st = availability?.[p] || 'onbekend';
    if (st === 'ja') ja.push(p);
    else if (st === 'nee') nee.push(p);
    else if (st === 'twijfel') twijfel.push(p);
    else onbekend.push(p);
  });

  const vsText = match.isHome ? `BV Hardenberg vs ${match.away}` : `${match.home} vs BV Hardenberg`;
  const typeText = match.isHome ? '🏠 Thuis' : '🚌 Uit';

  let msg = `🏸 *${vsText}* (${typeText})\n`;
  msg += `📅 ${match.day} ${match.date} om ${match.time} uur\n`;
  msg += `📍 ${match.location}\n\n`;

  msg += `🟢 *Aanwezig (${ja.length})*: ${ja.length > 0 ? ja.join(', ') : 'nog niemand'}\n`;
  if (twijfel.length > 0) msg += `🟡 *Twijfel (${twijfel.length})*: ${twijfel.join(', ')}\n`;
  if (nee.length > 0) msg += `🔴 *Afwezig (${nee.length})*: ${nee.join(', ')}\n`;
  if (onbekend.length > 0) msg += `⚪ *Nog invullen (${onbekend.length})*: ${onbekend.join(', ')}\n`;

  if (!match.isHome && extra?.driver) msg += `\n🚗 *Chauffeur*: ${extra.driver}`;

  msg += `\n\nGeef je aanwezigheid door via:\nhttps://schema.bartpullen.nl`;

  return msg;
}
