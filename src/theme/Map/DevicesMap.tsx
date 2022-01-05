import type { GoliothDevice } from 'api/api'
import type { GNSS } from 'device/state'
import { useApi } from 'hooks/useApi'
import { useCurrentProject } from 'hooks/useCurrentProject'
import { SensorProperties } from 'hooks/useDeviceHistory'
import { useDevices } from 'hooks/useDevices'
import type { Position } from 'hooks/useMapData'
import type { Map as LeafletMap } from 'leaflet'
import React, { useEffect, useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { Link } from 'react-router-dom'
import styles from 'theme/Map/DevicesMap.module.css'
import { ProjectSelector } from 'theme/ProjectSelector'
import { RelativeTime } from 'theme/RelativeTime'
import { markerIcon } from './MarkerIcon'

export const DevicesMap = () => {
	const [map, setmap] = useState<LeafletMap>()
	const [positions, setPositions] = useState<
		{
			device: GoliothDevice
			position: GNSS
			ts: Date
		}[]
	>([])

	const { project } = useCurrentProject()
	const devices = useDevices(project)
	const api = useApi()

	useEffect(() => {
		if (project === undefined) return
		Promise.all(
			devices.map(async (device) =>
				api
					.project(project)
					.device(device)
					.history<GNSS>({
						path: [SensorProperties.GNSS, 'v'],
						limit: 1,
					})
					.then(([{ v, ts }]) => ({ position: v, device, ts })),
			),
		)
			.then(setPositions)
			.catch(console.error)
	}, [project, devices, api])

	const center: Position = {
		lat: 63.421057567379194,
		lng: 10.43714466087136,
	}

	const zoom = 3

	if (map) {
		map.flyTo(center)
	}

	return (
		<main className={styles.devicesMap}>
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
				{positions.map(({ position, device, ts }) => (
					<Marker position={position} icon={markerIcon} key={device.id}>
						<Popup>
							<Link to={`/project/${project?.id}/device/${device.id}`}>
								{device.name}
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
