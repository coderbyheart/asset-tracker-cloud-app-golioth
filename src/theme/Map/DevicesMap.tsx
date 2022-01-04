import type { Position } from 'hooks/useMapData'
import type { Map as LeafletMap } from 'leaflet'
import React, { useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import styles from 'theme/Map/DevicesMap.module.css'
import { markerIcon } from './MarkerIcon'

export const DevicesMap = () => {
	const [map, setmap] = useState<LeafletMap>()

	const center: Position = {
		lat: 63.421057567379194,
		lng: 10.43714466087136,
	}

	const zoom = 3

	if (map) {
		map.flyTo(center)
	}

	return (
		<main>
			<MapContainer
				center={[center.lat, center.lng]}
				zoom={zoom}
				whenCreated={setmap}
				className={styles.mapContainer}
			>
				<TileLayer
					attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				<Marker position={center} icon={markerIcon}>
					<Popup>Center</Popup>
				</Marker>
			</MapContainer>
		</main>
	)
}
