import { useAssetLocations } from 'golioth/hooks/useAssetLocation'
import { useCurrentProject } from 'golioth/hooks/useCurrentProject'
import type { Position } from 'hooks/useMapData'
import type { Map as LeafletMap } from 'leaflet'
import React, { useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { Link } from 'react-router-dom'
import styles from 'themed/Map/AssetsMap.module.css'
import { markerIcon } from 'themed/Map/MarkerIcon'
import { ProjectSelector } from 'themed/ProjectSelector'
import { RelativeTime } from 'themed/RelativeTime'

export const AssetsMap = () => {
	const [map, setmap] = useState<LeafletMap>()
	const { project } = useCurrentProject()
	const positions = useAssetLocations()

	const center: Position = {
		lat: 63.421057567379194,
		lng: 10.43714466087136,
	}

	const zoom = 3

	if (map) {
		map.flyTo(center)
	}

	return (
		<main className={styles.assetsMap}>
			<ProjectSelector />
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
				{positions.map(({ position, asset, ts }) => (
					<Marker position={position} icon={markerIcon} key={asset.id}>
						<Popup>
							<Link to={`/project/${project?.id}/asset/${asset.id}`}>
								{asset.name}
							</Link>
							<br />
							<RelativeTime ts={ts} />
						</Popup>
					</Marker>
				))}
			</MapContainer>
		</main>
	)
}