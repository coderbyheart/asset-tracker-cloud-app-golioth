import type {
	Device,
	DeviceHistory,
	DeviceHistoryDatum,
	GNSS,
} from '../api/api'

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

const toLocation = (locationHistory: DeviceHistoryDatum<GNSS>) => ({
	location: {
		position: {
			lat: locationHistory.v.lat,
			lng: locationHistory.v.lng,
			accuracy: locationHistory.v.acc,
			altitude: locationHistory.v.alt,
			speed: locationHistory.v.spd,
			heading: locationHistory.v.hdg,
		},
		ts: new Date(locationHistory.ts),
	},
	roaming: undefined, // FIXME: implement
})

export const useMapData = ({
	locationHistory,
}: {
	locationHistory: DeviceHistory<GNSS>
}): {
	deviceLocation?: Location
	center?: Position
	history: {
		location: Location
		roaming?: Roaming
	}[]
} => {
	let deviceLocation: Location | undefined = undefined
	const firstLocation = locationHistory[0]
	if (firstLocation !== undefined) {
		deviceLocation = toLocation(firstLocation).location
	}
	const center = deviceLocation?.position

	return {
		deviceLocation,
		center,
		history: locationHistory.slice(1)?.map(toLocation) ?? [],
	}
}
