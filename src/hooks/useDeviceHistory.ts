import type { GoliothDevice } from 'api/api'
import type {
	Battery,
	Button,
	DeviceHistory,
	DeviceInfo,
	DeviceSensor,
	Environment,
	GNSS,
	Roaming,
} from 'device/state'
import { useApi } from 'hooks/useApi'
import { useEffect, useState } from 'react'

export enum SensorProperties {
	Battery = 'bat',
	Environment = 'env',
	GNSS = 'gnss',
	Roaming = 'roam',
	Device = 'dev',
	Button = 'btn',
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
			device: GoliothDevice
			sensor: SensorProperties.GNSS
		} & SharedArgs,
	): DeviceHistory<GNSS>
	(
		_: {
			device: GoliothDevice
			sensor: SensorProperties.Battery
		} & SharedArgs,
	): DeviceHistory<Battery>
	(
		_: {
			device: GoliothDevice
			sensor: SensorProperties.Environment
		} & SharedArgs,
	): DeviceHistory<Environment>
	(
		_: {
			device: GoliothDevice
			sensor: SensorProperties.Roaming
		} & SharedArgs,
	): DeviceHistory<Roaming>
	(
		_: {
			device: GoliothDevice
			sensor: SensorProperties.Device
		} & SharedArgs,
	): DeviceHistory<DeviceInfo>
	(
		_: {
			device: GoliothDevice
			sensor: SensorProperties.Button
		} & SharedArgs,
	): DeviceHistory<Button>
}

export const useDeviceHistory: useDeviceHistoryType = <T extends DeviceSensor>({
	device,
	sensor,
	limit,
	startDate,
	endDate,
}: {
	device: GoliothDevice
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
