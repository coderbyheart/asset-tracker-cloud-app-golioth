import { useEffect, useState } from 'react'
import type {
	Battery,
	Device,
	DeviceHistory,
	DeviceInfo,
	DeviceSensor,
	Environment,
	GNSS,
	Roaming,
} from 'api/api'
import { useApi } from 'hooks/useApi'

export enum SensorProperties {
	Battery = 'bat',
	Environment = 'env',
	GNSS = 'gps',
	// FIXME: https://github.com/NordicSemiconductor/asset-tracker-cloud-docs/pull/352
	// GNSS = 'gnss',
	Roaming = 'roam',
	Device = 'dev',
}

type PropertyName = SensorProperties | string

type SharedArgs = {
	limit?: number
	startDate?: Date
	endDate?: Date
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
	(
		_: {
			device: Device
			sensor: SensorProperties.Roaming
		} & SharedArgs,
	): DeviceHistory<Roaming>
	(
		_: {
			device: Device
			sensor: SensorProperties.Device
		} & SharedArgs,
	): DeviceHistory<DeviceInfo>
}

export const useDeviceHistory: useDeviceHistoryType = <T extends DeviceSensor>({
	device,
	sensor,
	limit,
	startDate,
	endDate,
}: {
	device: Device
	sensor: PropertyName
	limit?: number
	startDate?: Date
	endDate?: Date
}): DeviceHistory<T> => {
	const [history, setHistory] = useState<DeviceHistory<T>>([])
	const api = useApi()

	useEffect(() => {
		api
			.project({ id: device.projectId })
			.device({ id: device.id })
			.history<T>({ path: [sensor, 'v'], limit, startDate, endDate })
			.then(setHistory)
			.catch(console.error)
	}, [device, api, sensor, limit, startDate, endDate])

	return history
}
