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
export type Button = number
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
export type DeviceSensor =
	| Battery
	| GNSS
	| Environment
	| Roaming
	| DeviceInfo
	| NCellMeasReport
	| Button
export type DeviceHistoryDatum<T extends DeviceSensor> = { ts: Date; v: T }
export type DeviceHistory<T extends DeviceSensor> = DeviceHistoryDatum<T>[]

export type NCellMeasReport = {
	reportId: string
	nw: string
	mcc: number
	mnc: number
	cell: number
	area: number
	earfcn: number
	adv: number
	rsrp: number
	rsrq: number
	nmr?: {
		earfcn: number
		cell: number
		rsrp: number
		rsrq: number
	}[]
	reportedAt: Date
	receivedAt: Date
	unresolved?: boolean
	position?: {
		lat: number
		lng: number
		accuracy: number
	}
}
