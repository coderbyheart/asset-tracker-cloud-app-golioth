import styles from 'components/Map/AssetsMap.module.css'
import { markerIcon } from 'components/Map/MarkerIcon'
import { ProjectSelector } from 'components/ProjectSelector'
import { RelativeTime } from 'components/RelativeTime'
import { useAssetLocations } from 'hooks/useAssetLocation'
import type { Position } from 'hooks/useMapData'
import { useProject } from 'hooks/useProject'
import type { Map as LeafletMap } from 'leaflet'
import { useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { Link } from 'react-router-dom'

export const AssetsMap = () => {
	const [map, setmap] = useState<LeafletMap>()
	const { project } = useProject()
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
