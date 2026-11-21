import { useCallback, useState } from 'react'
import { storage } from './storage'

const KEY = 'sunsetspots.favorites'

/** Favoriten pro Gerät (localStorage). */
export function useFavorites() {
  const [favs, setFavs] = useState(() => new Set(storage.get(KEY, [])))
  const toggle = useCallback((id) => {
    setFavs((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      storage.set(KEY, [...next])
      return next
    })
  }, [])
  return { favs, toggle, isFav: (id) => favs.has(id) }
}
