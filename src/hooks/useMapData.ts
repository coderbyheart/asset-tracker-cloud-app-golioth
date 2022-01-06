import type { AssetHistory, AssetHistoryDatum, GNSS } from 'asset/state'

export type Position = { lat: number; lng: number }

export type Location = {
	position: Position & {
		accuracy?: number
		heading?: number
		altitude?: number
		speed?: number
	}
	batch: boolean
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

const toLocation =
	(batch = false) =>
	(locationHistory: AssetHistoryDatum<GNSS>) => ({
		location: {
			position: {
				lat: locationHistory.v.lat,
				lng: locationHistory.v.lng,
				accuracy: locationHistory.v.acc,
				altitude: locationHistory.v.alt,
				speed: locationHistory.v.spd,
				heading: locationHistory.v.hdg,
			},
			batch,
			ts: new Date(locationHistory.ts),
		},
		roaming: undefined, // FIXME: implement
	})

export const useMapData = ({
	locationHistory,
}: {
	locationHistory: AssetHistory<GNSS>
}): {
	assetLocation?: Location
	center?: Position
	history: {
		location: Location
		roaming?: Roaming
	}[]
} => {
	let assetLocation: Location | undefined = undefined
	const firstLocation = locationHistory[0]
	if (firstLocation !== undefined) {
		assetLocation = toLocation(false)(firstLocation).location
	}
	const center = assetLocation?.position

	return {
		assetLocation,
		center,
		history: locationHistory.slice(1)?.map(toLocation(false)) ?? [],
	}
}
