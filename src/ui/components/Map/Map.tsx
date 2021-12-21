import React, { useState } from 'react'
import type { Device } from 'api/api'
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
import { NoMap } from './NoMap'
import { useMapData } from 'hooks/useMapData'
import type { Position } from 'hooks/useMapData'
import { useMapSettings } from 'hooks/useMapSettings'
import { toFixed } from 'utils/toFixed'
import { nullOrUndefined } from 'utils/nullOrUndefined'
import { formatDistanceToNow } from 'date-fns'
import { SignalQuality } from 'ui/components/Device/SignalQuality'
import { SensorProperties, useDeviceHistory } from 'hooks/useDeviceHistory'
import { useChartDateRange } from 'hooks/useChartDateRange'

import styles from 'ui/components/Map/Map.module.css'

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

export const Map = ({ device }: { device: Device }) => {
	const { settings, update: updateSettings } = useMapSettings()
	const { startDate, endDate } = useChartDateRange()
	const locationHistory = useDeviceHistory({
		device,
		sensor: SensorProperties.GNSS,
		limit: settings.enabledLayers.history ? undefined : 1,
		startDate,
		endDate,
	})
	const { deviceLocation, center, history } = useMapData({
		locationHistory,
	})
	const [map, setmap] = useState<LeafletMap>()

	if (deviceLocation === undefined || center === undefined) return <NoMap /> // No location data at all to display

	if (map && settings.follow) {
		map.flyTo(center, settings.zoom)
	}

	return (
		<MapContainer
			center={[center.lat, center.lng]}
			zoom={settings.zoom}
			whenCreated={setmap}
			className={styles.mapContainer}
		>
			<EventHandler
				onZoomEnd={({ map }) => {
					updateSettings({ zoom: map.getZoom() })
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
			{settings.enabledLayers.headings &&
				deviceLocation?.position.heading !== undefined && (
					<HeadingMarker
						position={deviceLocation.position}
						heading={deviceLocation.position.heading}
						mapZoom={settings.zoom}
					/>
				)}
			{(history?.length ?? 0) > 0 &&
				history?.map(
					(
						{
							location: {
								position: { lat, lng, accuracy, heading, speed },
								batch,
								ts,
							},
							roaming,
						},
						k,
					) => {
						const alpha = Math.round((1 - k / history.length) * 255).toString(
							16,
						)
						const color = `#1f56d2${alpha}`

						return (
							<React.Fragment key={`history-${k}`}>
								<Circle center={{ lat, lng }} radius={1} color={color} />
								{k > 0 && (
									<Polyline
										positions={[history[k - 1].location.position, { lat, lng }]}
										weight={settings.zoom > 16 ? 1 : 2}
										lineCap={'round'}
										color={color}
										dashArray={'10'}
									/>
								)}
								{heading !== undefined && settings.enabledLayers.headings && (
									<HeadingMarker
										position={{ lat, lng }}
										heading={heading}
										mapZoom={settings.zoom}
										color={'#00000080'}
									/>
								)}
								{batch && (
									<Circle
										center={{ lat, lng }}
										radius={20}
										stroke={true}
										color={'#ff0000'}
										weight={2}
										fill={false}
										dashArray={settings.zoom > 16 ? '3 6' : '6 12'}
									/>
								)}
								<Circle
									center={{ lat, lng }}
									radius={16}
									fillColor={'#826717'}
									stroke={false}
								>
									<Popup position={{ lat, lng }}>
										<div className={styles.historyInfo}>
											{!nullOrUndefined(accuracy) && (
												<>
													<dt>Accuracy</dt>
													<dd>{toFixed(accuracy as number)} m</dd>
												</>
											)}
											{!nullOrUndefined(speed) && (
												<>
													<dt>Speed</dt>
													<dd>{toFixed(speed as number)} m/s</dd>
												</>
											)}
											{!nullOrUndefined(heading) && (
												<>
													<dt>Heading</dt>
													<dd>{toFixed(heading as number)}°</dd>
												</>
											)}
											<dt>Time</dt>
											<dd>
												<time dateTime={new Date(ts).toISOString()}>
													{formatDistanceToNow(ts, {
														includeSeconds: true,
														addSuffix: true,
													})}
												</time>
											</dd>
											{batch && (
												<>
													<dt>Batch</dt>
													<dd>Yes</dd>
												</>
											)}
										</div>
										{roaming !== undefined && !batch && (
											<>
												<div className={styles.historyInfo}>
													<dt>Connection</dt>
													<dd style={{ textAlign: 'right' }}>
														<SignalQuality dbm={roaming.roaming.rsrp} />
													</dd>
													<dt>MCC/MNC</dt>
													<dd>{roaming.roaming.mccmnc}</dd>
													<dt>Area Code</dt>
													<dd>{roaming.roaming.area}</dd>
													<dt>Cell ID</dt>
													<dd>{roaming.roaming.cell}</dd>
													<dt>IP</dt>
													<dd>{roaming.roaming.ip}</dd>
													<dt>RSRP</dt>
													<dd>{roaming.roaming.rsrp}</dd>
													<dt>Time</dt>
													<dd>
														<time dateTime={new Date(roaming.ts).toISOString()}>
															{formatDistanceToNow(roaming.ts, {
																includeSeconds: true,
																addSuffix: true,
															})}
														</time>
													</dd>
												</div>
											</>
										)}
									</Popup>
								</Circle>
							</React.Fragment>
						)
					},
				)}
		</MapContainer>
	)
}
