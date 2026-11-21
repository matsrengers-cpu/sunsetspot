import { supabase, isSupabaseConfigured, PHOTO_BUCKET } from './supabase'
import { SAMPLE_SPOTS } from '../data/sampleSpots'
import { resizeImage, blobToDataUrl } from './image'
import { storage } from './storage'

export const SPOT_TYPES = {
  strand: { label: 'Strand', icon: '🏖️' },
  berg: { label: 'Berg', icon: '⛰️' },
  dach: { label: 'Dach', icon: '🏢' },
  see: { label: 'See', icon: '🌊' },
  skyline: { label: 'Skyline', icon: '🌆' },
}

export const SUITABILITY = {
  sunrise: { label: 'gut für Sonnenaufgang', short: 'Aufgang', hint: 'freier Blick nach Osten' },
  sunset: { label: 'gut für Sonnenuntergang', short: 'Untergang', hint: 'freier Blick nach Westen' },
  both: { label: 'Auf- & Untergang', short: 'Beides', hint: 'freier Blick nach Osten und Westen' },
}

export const matchesMode = (spot, mode) => spot.suitability === 'both' || spot.suitability === mode

const LOCAL_KEY = 'sunsetspots.localSpots'

/** Lädt alle Spots. Ohne Supabase-Konfiguration: Beispiel-Spots + lokal angelegte (Demo-Modus). */
export async function loadSpots() {
  if (!isSupabaseConfigured) {
    return [...SAMPLE_SPOTS, ...storage.get(LOCAL_KEY, [])]
  }
  const { data, error } = await supabase
    .from('spots')
    .select('id,name,type,suitability,description,lat,lng,photo_url,created_at')
    .order('created_at', { ascending: false })
    .limit(2000)
  if (error) throw error
  return data
}

/** Legt einen neuen Spot an (inkl. optionalem Foto-Upload). */
export async function createSpot({ name, type, suitability, description, lat, lng, file }) {
  const base = {
    name: name.trim(),
    type,
    suitability,
    description: description?.trim() || null,
    lat: +lat.toFixed(6),
    lng: +lng.toFixed(6),
  }

  if (!isSupabaseConfigured) {
    let photo_url = null
    if (file) photo_url = await blobToDataUrl(await resizeImage(file, 800, 0.75))
    const spot = { ...base, id: `local-${Date.now()}`, photo_url, created_at: new Date().toISOString() }
    const list = storage.get(LOCAL_KEY, [])
    storage.set(LOCAL_KEY, [...list, spot])
    return spot
  }

  let photo_url = null
  if (file) {
    const blob = await resizeImage(file)
    const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.jpg`
    const { error: upErr } = await supabase.storage
      .from(PHOTO_BUCKET)
      .upload(path, blob, { contentType: 'image/jpeg', cacheControl: '31536000' })
    if (upErr) throw upErr
    photo_url = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl
  }

  const { data, error } = await supabase.from('spots').insert({ ...base, photo_url }).select().single()
  if (error) throw error
  return data
}
