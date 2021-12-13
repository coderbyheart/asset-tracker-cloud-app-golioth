import { useEffect, useState } from 'react'
import type {
	Battery,
	Device,
	DeviceHistory,
	DeviceSensor,
	GNSS,
} from 'api/api'
import { useApi } from 'hooks/useApi'

export enum SensorProperties {
	Battery = 'bat',
	GNSS = 'gps',
	// FIXME: https://github.com/NordicSemiconductor/asset-tracker-cloud-docs/pull/352
	// GNSS = 'gnss',
}

type PropertyName = SensorProperties | string

type SharedArgs = { load?: boolean; limit?: number }

type useDeviceHistory = {
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
}

export const useDeviceHistory: useDeviceHistory = <T extends DeviceSensor>({
	device,
	sensor,
	load,
	limit,
}: {
	device: Device
	sensor: PropertyName
	load?: boolean
	limit?: number
}): DeviceHistory<T> => {
	const [history, setHistory] = useState<DeviceHistory<T>>([])
	const api = useApi()

	useEffect(() => {
		if (load === false) return
		api
			.project({ id: device.projectId })
			.device({ id: device.id })
			.history<T>({ path: [sensor, 'v'], limit })
			.then(setHistory)
			.catch(console.error)
	}, [device, api, sensor, limit, load])

	return history
}
