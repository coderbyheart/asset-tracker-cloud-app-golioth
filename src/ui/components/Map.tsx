import React, { useState } from 'react'
import type { Device, DeviceState } from '../../api/api'
import styled from 'styled-components'
import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	Circle,
	Polyline,
	MapConsumer,
	useMapEvents,
} from 'react-leaflet'
import type { LeafletEvent, Map as LeafletMap } from 'leaflet'
import { NoMap } from './Map/NoMap'
import { mapData, Position } from '../../hooks/mapData'

const MapContainerContainer = styled.div`
	> .leaflet-container {
		height: 300px;
	}
`

const EventHandler = ({
	onZoomEnd,
}: {
	onZoomEnd: (args: { event: LeafletEvent; map: LeafletMap }) => void
}) => {
	const map = useMapEvents({
		zoomend: (event) => onZoomEnd({ event, map }),
	})
	return null
}

const HeadingMarker = ({
	heading,
	position,
	mapZoom,
	color,
}: {
	position: Position
	heading: number
	mapZoom: number
	color?: string
}) => (
	<MapConsumer key={mapZoom}>
		{(map) => {
			const { x, y } = map.project(position, mapZoom)
			const endpoint = map.unproject(
				[
					x + mapZoom * 3 * Math.cos((((heading - 90) % 360) * Math.PI) / 180),
					y + mapZoom * 3 * Math.sin((((heading - 90) % 360) * Math.PI) / 180),
				],
				mapZoom,
			)
			return (
				<Polyline
					positions={[position, endpoint]}
					weight={mapZoom > 16 ? 1 : 2}
					lineCap={'round'}
					color={color ?? '#000000'}
				/>
			)
		}}
	</MapConsumer>
)

export const Map = ({
	device,
	deviceState,
}: {
	device: Device
	deviceState: DeviceState
}) => {
	const { deviceLocation, center, zoom } = mapData({ deviceState })
	const [mapZoom, setMapZoom] = useState(zoom)
	const [map, setmap] = useState<LeafletMap>()

	if (deviceLocation === undefined || center === undefined) return <NoMap /> // No location data at all to display

	if (map) {
		map.flyTo(center, zoom)
	}

	return (
		<MapContainerContainer>
			<MapContainer
				center={[center.lat, center.lng]}
				zoom={zoom}
				whenCreated={setmap}
			>
				<EventHandler
					onZoomEnd={({ map }) => {
						window.localStorage.setItem(
							'asset-tracker:zoom',
							`${map.getZoom()}`,
						)
						setMapZoom(map.getZoom())
					}}
				/>
				<TileLayer
					attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<Marker position={center}>
					<Popup>{device.name}</Popup>
				</Marker>
				{deviceLocation?.position.accuracy !== undefined && (
					<Circle
						center={deviceLocation.position}
						radius={deviceLocation.position.accuracy}
					/>
				)}
				{deviceLocation?.position.heading !== undefined && (
					<HeadingMarker
						position={deviceLocation.position}
						heading={deviceLocation.position.heading}
						mapZoom={mapZoom}
					/>
				)}
			</MapContainer>
		</MapContainerContainer>
	)
}
