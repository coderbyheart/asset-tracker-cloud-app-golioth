import type { DeviceState } from '../api/api'

export type Position = { lat: number; lng: number }

export type Location = {
	position: Position & {
		accuracy?: number
		heading?: number
		altitude?: number
		speed?: number
	}
	batch?: boolean
	ts: Date
}

export type CellLocation = {
	position: Position & { accuracy: number }
	ts: Date
}

export type Roaming = {
	roaming: {
		mccmnc: number
		rsrp: number
		cell: number
		area: number
		ip: string
	}
	ts: Date
}
export const mapData = ({
	deviceState,
}: {
	deviceState: DeviceState
}): {
	zoom: number
	deviceLocation?: Location
	center?: Position
} => {
	let deviceLocation: Location | undefined = undefined
	if (deviceState.reported?.gps !== undefined) {
		deviceLocation = {
			position: {
				lat: deviceState.reported.gps.v.lat,
				lng: deviceState.reported.gps.v.lng,
				accuracy: deviceState.reported.gps.v.acc,
				altitude: deviceState.reported.gps.v.alt,
				speed: deviceState.reported.gps.v.spd,
			},
			ts: new Date(deviceState.reported.gps.ts),
		}
	}

	let zoom = 13
	const userZoom = window.localStorage.getItem('asset-tracker:zoom')
	if (userZoom !== null) {
		zoom = parseInt(userZoom, 10)
	}

	const center = deviceLocation?.position

	return {
		deviceLocation,
		center,
		zoom,
	}
}
