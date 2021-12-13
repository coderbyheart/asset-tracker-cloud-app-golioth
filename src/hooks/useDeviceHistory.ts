import { useEffect, useState } from 'react'
import type {
	Battery,
	Device,
	DeviceHistory,
	DeviceSensor,
	Environment,
	GNSS,
} from 'api/api'
import { useApi } from 'hooks/useApi'

export enum SensorProperties {
	Battery = 'bat',
	Environment = 'env',
	GNSS = 'gps',
	// FIXME: https://github.com/NordicSemiconductor/asset-tracker-cloud-docs/pull/352
	// GNSS = 'gnss',
}

type PropertyName = SensorProperties | string

type SharedArgs = {
	load?: boolean
	limit?: number
	startDate: Date
	endDate: Date
}

type useDeviceHistoryType = {
	(
		_: {
			device: Device
			sensor: SensorProperties.GNSS
		} & SharedArgs,
	): DeviceHistory<GNSS>
	(
		_: {
			device: Device
			sensor: SensorProperties.Battery
		} & SharedArgs,
	): DeviceHistory<Battery>
	(
		_: {
			device: Device
			sensor: SensorProperties.Environment
		} & SharedArgs,
	): DeviceHistory<Environment>
}

export const useDeviceHistory: useDeviceHistoryType = <T extends DeviceSensor>({
	device,
	sensor,
	load,
	limit,
	startDate,
	endDate,
}: {
	device: Device
	sensor: PropertyName
	load?: boolean
	limit?: number
	startDate: Date
	endDate: Date
}): DeviceHistory<T> => {
	const [history, setHistory] = useState<DeviceHistory<T>>([])
	const api = useApi()

	useEffect(() => {
		if (load === false) return
		if (startDate === undefined) return
		if (endDate === undefined) return
		api
			.project({ id: device.projectId })
			.device({ id: device.id })
			.history<T>({ path: [sensor, 'v'], limit, startDate, endDate })
			.then(setHistory)
			.catch(console.error)
	}, [device, api, sensor, limit, load, startDate, endDate])

	return history
}
