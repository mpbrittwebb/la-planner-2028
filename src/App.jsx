import { useMemo, useState } from 'react'
import './App.css'

const GROUP_ORDER = ['Ava', 'Josie', 'Matthew', 'Jacob']
const WINDOW_CAPACITY = 12
const ALLOWED_ZONES = ['DTLA', 'Long Beach', 'Carson', 'Valley', 'Pasadena', 'Westside']
const EXCLUDED_KEYWORDS = ['Oklahoma City', 'Surfing']
const TRAFFIC_ZONES = new Set(['DTLA', 'Westside', 'Pasadena', 'Valley'])

const SESSIONS = [
  // TIER 1: GYMNASTICS ANCHORS & FALLBACKS (DTLA Zone)
  { id: 'GAR11', sport: 'Artistic Gymnastics', phase: "Women's All-Around Final", zone: 'DTLA', venue: 'DTLA Arena', start: '2028-07-20T18:00:00', medalSession: true, tier: 1 },
  { id: 'GAR09', sport: 'Artistic Gymnastics', phase: "Women's Team Final", zone: 'DTLA', venue: 'DTLA Arena', start: '2028-07-18T18:00:00', medalSession: true, tier: 1 },
  { id: 'GAR08', sport: 'Artistic Gymnastics', phase: "Men's Team Final", zone: 'DTLA', venue: 'DTLA Arena', start: '2028-07-17T17:15:00', medalSession: true, tier: 1 },
  { id: 'GAR12', sport: 'Artistic Gymnastics', phase: 'Apparatus Finals Day 1', zone: 'DTLA', venue: 'DTLA Arena', start: '2028-07-22T11:30:00', medalSession: true, tier: 1 },
  { id: 'GAR06', sport: 'Artistic Gymnastics', phase: "Women's Qual 4", zone: 'DTLA', venue: 'DTLA Arena', start: '2028-07-16T18:15:00', medalSession: false, tier: 1.5 },
  { id: 'GAR04', sport: 'Artistic Gymnastics', phase: "Women's Qual 1 & 2", zone: 'DTLA', venue: 'DTLA Arena', start: '2028-07-16T09:45:00', medalSession: false, tier: 1.5 },

  // TIER 2: NICHE MEDAL CORES (Pasadena & DTLA Zones)
  { id: 'DIV12', sport: 'Diving', phase: "Men's 10m Platform Final", zone: 'Pasadena', venue: 'Rose Bowl Aquatics', start: '2028-07-22T15:30:00', medalSession: true, tier: 2 },
  { id: 'DIV06', sport: 'Diving', phase: "Women's 10m Platform Final", zone: 'Pasadena', venue: 'Rose Bowl Aquatics', start: '2028-07-17T15:30:00', medalSession: true, tier: 2 },
  { id: 'DIV01', sport: 'Diving', phase: "Women's Synchro 3m Final", zone: 'Pasadena', venue: 'Rose Bowl Aquatics', start: '2028-07-16T10:00:00', medalSession: true, tier: 2 },
  { id: 'TTE09', sport: 'Table Tennis', phase: 'Mixed Doubles Gold', zone: 'DTLA', venue: 'Convention Center', start: '2028-07-17T21:00:00', medalSession: true, tier: 2 },
  { id: 'TTE12', sport: 'Table Tennis', phase: "Men's Singles Gold", zone: 'DTLA', venue: 'Convention Center', start: '2028-07-19T21:00:00', medalSession: true, tier: 2 },
  { id: 'FEN02', sport: 'Fencing', phase: 'Indiv. Sabre/Epee Gold', zone: 'DTLA', venue: 'Convention Center', start: '2028-07-15T18:30:00', medalSession: true, tier: 2 },
  { id: 'FEN12', sport: 'Fencing', phase: "Men's Epee Team Final", zone: 'DTLA', venue: 'Convention Center', start: '2028-07-20T18:30:00', medalSession: true, tier: 2 },
  { id: 'TRA01', sport: 'Trampoline', phase: "Men's & Women's Finals", zone: 'DTLA', venue: 'DTLA Arena', start: '2028-07-21T15:00:00', medalSession: true, tier: 2 },

  // TIER 3: ATMOSPHERE & VALUE FILLERS (Long Beach, Carson, & Valley Zones)
  { id: 'BVO01', sport: 'Beach Volleyball', phase: 'Preliminary Round', zone: 'Long Beach', venue: 'LB Waterfront', start: '2028-07-15T09:00:00', medalSession: false, tier: 3 },
  { id: 'BVO20', sport: 'Beach Volleyball', phase: 'Night Prelims', zone: 'Long Beach', venue: 'LB Waterfront', start: '2028-07-19T20:00:00', medalSession: false, tier: 3 },
  { id: 'CLB04', sport: 'Sport Climbing', phase: 'Speed Finals', zone: 'Long Beach', venue: 'LB Sports Park', start: '2028-07-26T18:45:00', medalSession: true, tier: 3 },
  { id: 'ARC03', sport: 'Archery', phase: 'Compound Mixed Team Final', zone: 'Carson', venue: 'Carson Stadium', start: '2028-07-21T19:30:00', medalSession: true, tier: 3 },
  { id: 'ARC11', sport: 'Archery', phase: "Women's Team Final", zone: 'Carson', venue: 'Carson Stadium', start: '2028-07-25T19:30:00', medalSession: true, tier: 3 },
  { id: 'SQU09', sport: 'Squash', phase: "Men's/Women's Finals", zone: 'DTLA', venue: 'Convention Center', start: '2028-07-23T20:30:00', medalSession: true, tier: 3 },
  { id: 'BDM15', sport: 'Badminton', phase: 'Mixed Doubles Finals', zone: 'DTLA', venue: 'Galen Center', start: '2028-07-21T08:00:00', medalSession: true, tier: 3 },
  { id: 'SKB05', sport: 'Skateboarding', phase: 'Street Finals', zone: 'Valley', venue: 'Valley Complex', start: '2028-07-25T10:30:00', medalSession: true, tier: 3 },
  { id: 'WPO25', sport: 'Water Polo', phase: "Women's Gold Medal", zone: 'Long Beach', venue: 'LB Sports Park', start: '2028-07-29T15:30:00', medalSession: true, tier: 3 },
  { id: 'TEN25', sport: 'Tennis', phase: "Men's Singles Final", zone: 'Carson', venue: 'Carson Tennis Center', start: '2028-07-23T12:00:00', medalSession: true, tier: 3 },
  { id: 'HBL45', sport: 'Handball', phase: "Women's Gold Medal", zone: 'Long Beach', venue: 'LB Arena', start: '2028-07-30T10:00:00', medalSession: true, tier: 3 },
  { id: 'ATH01', sport: 'Athletics', phase: 'Evening Session (Value)', zone: 'DTLA', venue: 'Memorial Coliseum', start: '2028-07-21T18:00:00', medalSession: false, tier: 3 },
]

function parseDate(value) {
  return new Date(value)
}

function isWeekdayPeak(date) {
  const day = date.getDay()
  const hour = date.getHours()
  const weekday = day >= 1 && day <= 5
  const peak = (hour >= 7 && hour <= 10) || (hour >= 16 && hour <= 19)
  return weekday && peak
}

function isWithinSixDayWindow(firstSecuredStart, candidateStart) {
  if (!firstSecuredStart) return true
  const msPerDay = 1000 * 60 * 60 * 24
  const gap = Math.abs(parseDate(candidateStart) - parseDate(firstSecuredStart))
  return gap / msPerDay <= 6
}

function differenceInDays(a, b) {
  const msPerDay = 1000 * 60 * 60 * 24
  return Math.abs(parseDate(a) - parseDate(b)) / msPerDay
}

function getZoneAnchor(wonSessions) {
  if (!wonSessions.length) return null
  const counts = wonSessions.reduce((acc, session) => {
    acc[session.zone] = (acc[session.zone] || 0) + 1
    return acc
  }, {})
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
}

function getLogisticsPenalty(session, anchorZone) {
  if (!anchorZone || anchorZone === session.zone) return 0
  return 50
}

function App() {
  const [wonSessions, setWonSessions] = useState([])
  const [rejectedIds, setRejectedIds] = useState([])
  const [spentTickets, setSpentTickets] = useState(0)
  const [over200Toggle, setOver200Toggle] = useState(false)
  const [ticketsToSecure, setTicketsToSecure] = useState(4)
  const [dollarsToSecure, setDollarsToSecure] = useState('')
  const [recommendationIndex, setRecommendationIndex] = useState(0)
  const [viewMode, setViewMode] = useState('pilot')

  const firstSecuredStart = wonSessions[0]?.start ?? null
  const anchorZone = getZoneAnchor(wonSessions)
  const remainingCapacity = WINDOW_CAPACITY - spentTickets

  const availableSessions = useMemo(() => SESSIONS.filter((session) => {
    if (rejectedIds.includes(session.id)) return false
    if (wonSessions.some((won) => won.id === session.id)) return false
    if (!ALLOWED_ZONES.includes(session.zone)) return false
    if (EXCLUDED_KEYWORDS.some((word) => session.zone.includes(word) || session.sport.includes(word))) return false
    if (!isWithinSixDayWindow(firstSecuredStart, session.start)) return false
    return true
  }), [firstSecuredStart, rejectedIds, wonSessions])

  const scoredSessions = useMemo(() => {
    if (remainingCapacity <= 0 || !availableSessions.length) return []

    const validSessions = availableSessions.filter((session) => {
      const dateCheck = !firstSecuredStart || differenceInDays(session.start, firstSecuredStart) <= 6
      const zoneCheck = session.zone !== 'Oklahoma City' && !session.venue.includes('Trestles')
      return dateCheck && zoneCheck
    })

    return validSessions.map((session) => {
      const baseScore = (10 - session.tier) * 100
      const logisticsPenalty = getLogisticsPenalty(session, anchorZone)
      const trafficPenalty =
        isWeekdayPeak(parseDate(session.start)) && anchorZone && session.zone !== anchorZone ? 100 : 0
      return {
        ...session,
        trafficRisk:
          anchorZone &&
          anchorZone !== session.zone &&
          TRAFFIC_ZONES.has(anchorZone) &&
          TRAFFIC_ZONES.has(session.zone) &&
          isWeekdayPeak(parseDate(session.start)),
        score: baseScore - logisticsPenalty - trafficPenalty,
      }
    }).sort((a, b) => b.score - a.score)
  }, [anchorZone, availableSessions, firstSecuredStart, remainingCapacity])

  const nextMove = useMemo(() => {
    if (!scoredSessions.length) return null
    const boundedIndex = Math.min(recommendationIndex, scoredSessions.length - 1)
    const top = scoredSessions[boundedIndex]
    const shouldPivot = over200Toggle && top.id.startsWith('GAR') && top.phase.includes('Final')
    if (shouldPivot) {
      return scoredSessions.find((session) => session.id === 'GAR06') ?? { ...top, id: 'GAR06', phase: 'Qualifying' }
    }
    return top
  }, [over200Toggle, recommendationIndex, scoredSessions])

  const activeRecommendationIndex = Math.min(recommendationIndex, Math.max(scoredSessions.length - 1, 0))

  const onSecured = () => {
    if (!nextMove) return
    const n = Math.max(1, Math.min(Number(ticketsToSecure) || 1, remainingCapacity))
    const dollars = Math.max(0, Number(dollarsToSecure) || 0)
    setWonSessions((prev) => [...prev, { ...nextMove, tickets: n, dollars }])
    setSpentTickets((prev) => prev + n)
    setRecommendationIndex(0)
    setDollarsToSecure('')
  }

  const onRejected = () => {
    if (!nextMove) return
    setRejectedIds((prev) => [...prev, nextMove.id])
  }

  const onRemoveSecured = (sessionKey) => {
    setWonSessions((prev) => {
      const match = prev.find((session) => `${session.id}-${session.start}` === sessionKey)
      if (!match) return prev
      const refunded = Number(match.tickets) || 0
      setSpentTickets((current) => Math.max(0, current - refunded))
      return prev.filter((session) => `${session.id}-${session.start}` !== sessionKey)
    })
  }

  const itinerary = [...wonSessions]
    .sort((a, b) => parseDate(a.start) - parseDate(b.start))
    .map((session) => ({
      ...session,
      dateLabel: parseDate(session.start).toLocaleString([], {
        weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
      }),
    }))

  const totalSpend = wonSessions.reduce((sum, session) => sum + (Number(session.dollars) || 0), 0)

  const sessionsBySport = useMemo(() => {
    const grouped = {}
    SESSIONS.forEach((session) => {
      if (!grouped[session.sport]) grouped[session.sport] = []
      grouped[session.sport].push(session)
    })
    return Object.entries(grouped)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([sport, sessions]) => ({
        sport,
        sessions: sessions.sort((a, b) => parseDate(a.start) - parseDate(b.start)),
      }))
  }, [])

  return (
    <main className="app">
      <section className="command-center">
        <header className="top">
          <div>
            <p className="eyebrow">LA28 Live Booking Pilot</p>
            <h1>Window 1: Ava Command Center</h1>
            <p className="sub">
              Operator order: {GROUP_ORDER.join(' -> ')} | Capacity used: {spentTickets}/{WINDOW_CAPACITY} tickets
            </p>
            <div className="mode-tabs">
              <button
                className={viewMode === 'pilot' ? 'tab active' : 'tab'}
                onClick={() => setViewMode('pilot')}
              >
                Live Pilot
              </button>
              <button
                className={viewMode === 'sports' ? 'tab active' : 'tab'}
                onClick={() => setViewMode('sports')}
              >
                By Sport
              </button>
            </div>
          </div>
          <label className="pivot-toggle">
            <input type="checkbox" checked={over200Toggle} onChange={(event) => setOver200Toggle(event.target.checked)} />
            Gymnastics price {'>'}$200 (auto-pivot to qualifying)
          </label>
        </header>

        {viewMode === 'pilot' && (
          <article className="next-card">
          <p className="label">Autopilot Next Move</p>
          {nextMove ? (
            <>
              <h2>{nextMove.id} - {nextMove.sport} ({nextMove.phase})</h2>
              <p className="meta">
                {nextMove.venue} | {nextMove.zone} | {parseDate(nextMove.start).toLocaleString([], {
                  weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                })}
              </p>
              <div className="tickets-row">
                <label className="tickets-label">
                  Tickets to secure now
                  <input
                    className="tickets-input"
                    type="number"
                    min={1}
                    max={Math.max(1, remainingCapacity)}
                    value={ticketsToSecure}
                    onChange={(e) => setTicketsToSecure(e.target.value)}
                  />
                </label>
                <p className="tickets-hint">Max this window: {remainingCapacity}</p>
              </div>
              <div className="tickets-row">
                <label className="tickets-label">
                  Dollars secured now ($)
                  <input
                    className="tickets-input"
                    type="number"
                    min={0}
                    step="1"
                    value={dollarsToSecure}
                    onChange={(e) => setDollarsToSecure(e.target.value)}
                    placeholder="0"
                  />
                </label>
                <p className="tickets-hint">Tracked per secured event</p>
              </div>
              {nextMove.trafficRisk && !nextMove.medalSession && (
                <p className="traffic amber">
                  Traffic Shield: cross-town peak-hour commute detected (kept only if medal priority requires it).
                </p>
              )}
              {nextMove.trafficRisk && nextMove.medalSession && (
                <p className="traffic">
                  Traffic Shield warning: cross-town peak commute accepted due to medal-session priority.
                </p>
              )}
              <div className="actions">
                <button className="go" onClick={onSecured}>Secured</button>
                <button className="stop" onClick={onRejected}>Sold Out / Over Budget / Pass</button>
              </div>
              <div className="nav-actions">
                <button
                  className="nav-btn"
                  onClick={() => setRecommendationIndex((idx) => Math.max(0, idx - 1))}
                  disabled={recommendationIndex <= 0}
                >
                  Back Event
                </button>
                <p className="nav-copy">
                  {Math.min(activeRecommendationIndex + 1, Math.max(scoredSessions.length, 1))} / {scoredSessions.length} ranked options
                </p>
              </div>
            </>
          ) : (
            <p className="empty">
              No eligible next move. Capacity may be full or all sessions were filtered by 6-day/zone logic.
            </p>
          )}
          </article>
        )}

        {viewMode === 'sports' && (
          <section className="sports-view">
            <p className="label">Session Library By Sport</p>
            <div className="sport-groups">
              {sessionsBySport.map((group) => (
                <article key={group.sport} className="sport-card">
                  <h3>{group.sport}</h3>
                  <ul>
                    {group.sessions.map((item) => (
                      <li key={item.id}>
                        <strong>{item.id}</strong> - {item.phase} - {item.zone} -{' '}
                        {parseDate(item.start).toLocaleString([], {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        )}

        <div className="status-grid">
          <div className="status">
            <p className="label">6-Day Rule Anchor</p>
            <strong>{firstSecuredStart ? parseDate(firstSecuredStart).toDateString() : 'Not set yet'}</strong>
          </div>
          <div className="status">
            <p className="label">Zone Heatmap Anchor</p>
            <strong>{anchorZone || 'Unanchored'}</strong>
          </div>
          <div className="status">
            <p className="label">Remaining Capacity</p>
            <strong>{remainingCapacity} tickets</strong>
          </div>
          <div className="status">
            <p className="label">Total Secured Spend</p>
            <strong>${totalSpend.toLocaleString()}</strong>
          </div>
        </div>
      </section>

      <aside className="sidebar">
        <h3>Live Itinerary</h3>
        {itinerary.length ? (
          <ul>
            {itinerary.map((item) => (
              <li key={item.id + item.start}>
                <p className="session">{item.id} - {item.sport}</p>
                <p>{item.dateLabel}</p>
                <p>{item.zone} | {item.venue}</p>
                <p><strong>{item.tickets ?? 4}</strong> tickets</p>
                <p><strong>${(Number(item.dollars) || 0).toLocaleString()}</strong> secured spend</p>
                <button
                  className="undo"
                  onClick={() => onRemoveSecured(`${item.id}-${item.start}`)}
                >
                  Undo / Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty">No sessions secured yet.</p>
        )}
      </aside>
    </main>
  )
}

export default App
