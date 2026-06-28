'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const ACCENT = '#2EC4C6'
const POSITION: [number, number] = [50.8176, 6.2607]

const pinIcon = L.divIcon({
  className: 'training-map-pin',
  html: `<span style="display:block;width:22px;height:22px;border-radius:50% 50% 50% 0;background:${ACCENT};transform:rotate(-45deg);border:2px solid #0A0A0A;box-shadow:0 0 0 4px rgba(46,196,198,0.3)"></span>`,
  iconSize: [22, 22],
  iconAnchor: [11, 22],
  popupAnchor: [0, -22],
})

interface TrainingMapProps {
  label?: string
}

export default function TrainingMap({
  label = 'Turnhalle am Talbahnhof, Eschweiler',
}: TrainingMapProps) {
  return (
    <MapContainer
      center={POSITION}
      zoom={15}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={POSITION} icon={pinIcon}>
        <Popup>{label}</Popup>
      </Marker>
    </MapContainer>
  )
}
