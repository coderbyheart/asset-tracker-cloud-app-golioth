export enum DataModules {
	GNSS = 'gnss',
	NeigboringCellMeasurements = 'ncell',
}

export type DeviceConfig = {
	act: boolean
	actwt: number
	mvres: number
	mvt: number
	gpst: number
	acct: number
	nod: DataModules[]
}

export type DeviceState = {
	cfg?: Partial<DeviceConfig>
}

export type DeviceTwin = {
	reported?: DeviceState
	desired?: DeviceState
}

export type Battery = number
export type Environment = {
	temp: number
	hum: number
}
export type GNSS = {
	acc: number
	alt: number
	hdg: number
	lat: number
	lng: number
	spd: number
}
export type Roaming = {
	area: number
	mccmnc: number
	cell: number
	ip: string
	rsrp: number
	band: string
	nw: string
}
export type DeviceInfo = {
	iccid: string
	modV: string
	brdV: string
}
export type DeviceSensor = Battery | GNSS | Environment | Roaming | DeviceInfo
export type DeviceHistoryDatum<T extends DeviceSensor> = { ts: Date; v: T }
export type DeviceHistory<T extends DeviceSensor> = DeviceHistoryDatum<T>[]
