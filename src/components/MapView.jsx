import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Circle, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { SPOT_TYPES } from '../lib/spots'
import { scoreInfo } from '../lib/weather'

const iconCache = new Map()
function spotIcon(type, color, selected, fav) {
  const key = `${type}|${color}|${selected}|${fav}`
  if (!iconCache.has(key)) {
    iconCache.set(
      key,
      L.divIcon({
        className: '',
        html: `<div class="spot-pin${selected ? ' selected' : ''}" style="--c:${color}"><span>${
          SPOT_TYPES[type]?.icon ?? '☀️'
        }</span>${fav ? '<b class="fav">❤️</b>' : ''}</div>`,
        iconSize: [44, 44],
        iconAnchor: [22, 50],
      }),
    )
  }
  return iconCache.get(key)
}
const userIcon = L.divIcon({ className: '', html: '<div class="user-dot"></div>', iconSize: [18, 18], iconAnchor: [9, 9] })
const newIcon = L.divIcon({ className: '', html: '<div class="new-pin"></div>', iconSize: [22, 22], iconAnchor: [11, 11] })

/** Passt den Kartenausschnitt an, wenn sich Mittelpunkt oder Radius ändern. */
function FitRadius({ center, radius }) {
  const map = useMap()
  useEffect(() => {
    const bounds = L.latLng(center.lat, center.lng).toBounds(radius * 2000)
    const mobile = window.innerWidth < 768
    map.flyToBounds(bounds, {
      paddingTopLeft: mobile ? [16, 190] : [460, 40],
      paddingBottomRight: mobile ? [16, 150] : [40, 40],
      duration: 0.8,
    })
  }, [center.lat, center.lng, radius, map])
  return null
}

function ClickHandler({ onClick }) {
  useMapEvents({ click: (e) => onClick?.(e.latlng) })
  return null
}

export default function MapView({ center, radius, spots, scores, selectedId, onSelect, favs, userPos, addMode, newPos, onMapClick, mode }) {
  const accent = mode === 'sunset' ? '#ff8a3d' : '#a78bfa'
  const circleStyle = useMemo(
    () => ({ color: accent, weight: 2, opacity: 0.8, fillColor: accent, fillOpacity: 0.06, dashArray: '6 8' }),
    [accent],
  )

  return (
    <div className={`absolute inset-0 ${addMode ? 'add-mode' : ''}`}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={12}
        className="h-full w-full dark-tiles"
        zoomControl={false}
        worldCopyJump
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <FitRadius center={center} radius={radius} />
        <ClickHandler onClick={onMapClick} />
        <Circle center={[center.lat, center.lng]} radius={radius * 1000} pathOptions={circleStyle} interactive={false} />
        {userPos && <Marker position={[userPos.lat, userPos.lng]} icon={userIcon} interactive={false} />}
        {spots.map((s) => (
          <Marker
            key={s.id}
            position={[s.lat, s.lng]}
            icon={spotIcon(s.type, scoreInfo(scores[s.id]).color, s.id === selectedId, favs.has(s.id))}
            eventHandlers={{ click: (e) => (addMode ? onMapClick?.(e.latlng) : onSelect(s.id)) }}
            title={s.name}
            keyboard
            zIndexOffset={s.id === selectedId ? 1000 : 0}
          />
        ))}
        {newPos && <Marker position={[newPos.lat, newPos.lng]} icon={newIcon} interactive={false} />}
      </MapContainer>
    </div>
  )
}
