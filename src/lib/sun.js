import * as SunCalc from 'suncalc'

// Zusätzliche Sonnenstände für die Blaue Stunde (Fotografen-Definition):
// Blaue Stunde: Sonne zwischen -8° und -4°, Goldene Stunde: zwischen -4° und +6°.
SunCalc.addTime(-4, 'blueHourMorningEnd', 'blueHourEveningStart')
SunCalc.addTime(-8, 'blueHourMorningStart', 'blueHourEveningEnd')

const valid = (d) => d instanceof Date && !Number.isNaN(d.getTime())

/** SunCalc >= 2.x liefert den Azimut bereits in Grad, im Uhrzeigersinn ab Norden. */
export function toBearing(azimuthDeg) {
  return ((azimuthDeg % 360) + 360) % 360
}

const DIRS = ['N', 'NNO', 'NO', 'ONO', 'O', 'OSO', 'SO', 'SSO', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
export function compassLabel(deg) {
  return DIRS[Math.round(deg / 22.5) % 16]
}

function dayLabel(date, now) {
  const d0 = new Date(now)
  d0.setHours(0, 0, 0, 0)
  const d1 = new Date(date)
  d1.setHours(0, 0, 0, 0)
  const diff = Math.round((d1 - d0) / 86400000)
  if (diff === 0) return 'Heute'
  if (diff === 1) return 'Morgen'
  return date.toLocaleDateString('de-DE', { weekday: 'long' })
}

/**
 * Liefert den jeweils nächsten Sonnenaufgang bzw. -untergang an einem Ort
 * inkl. Goldener/Blauer Stunde und Himmelsrichtung.
 * @param {'sunrise'|'sunset'} mode
 */
export function getNextSunEvent(mode, lat, lng, now = new Date()) {
  for (let offset = 0; offset < 4; offset++) {
    const day = new Date(now)
    day.setDate(day.getDate() + offset)
    day.setHours(12, 0, 0, 0)
    const t = SunCalc.getTimes(day, lat, lng)
    const time = mode === 'sunset' ? t.sunset : t.sunrise
    if (!valid(time) || time.getTime() < now.getTime()) continue

    const golden =
      mode === 'sunset'
        ? { start: t.goldenHour, end: t.blueHourEveningStart }
        : { start: t.blueHourMorningEnd, end: t.goldenHourEnd }
    const blue =
      mode === 'sunset'
        ? { start: t.blueHourEveningStart, end: t.blueHourEveningEnd }
        : { start: t.blueHourMorningStart, end: t.blueHourMorningEnd }

    const bearing = toBearing(SunCalc.getPosition(time, lat, lng).azimuth)
    return {
      mode,
      time,
      golden,
      blue,
      bearing,
      compass: compassLabel(bearing),
      day: dayLabel(time, now),
    }
  }
  return null // z.B. Polartag/-nacht
}

export function fmtTime(d) {
  if (!valid(d)) return '–'
  return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

export function fmtRange(r) {
  if (!r) return '–'
  return `${fmtTime(r.start)} – ${fmtTime(r.end)}`
}
