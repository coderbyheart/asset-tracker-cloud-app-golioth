import type { GoliothDevice } from 'api/api'
import type { GNSS } from 'device/state'
import { useEffect, useState } from 'react'
import { useApi } from './useApi'
import { useCurrentProject } from './useCurrentProject'
import { SensorProperties } from './useDeviceHistory'
import { useDevices } from './useDevices'

type DeviceLocation = {
	device: GoliothDevice
	position: GNSS
	ts: Date
}
export const useDeviceLocations = (): DeviceLocation[] => {
	const [positions, setPositions] = useState<DeviceLocation[]>([])

	const { project } = useCurrentProject()
	const devices = useDevices(project)
	const api = useApi()

	useEffect(() => {
		if (project === undefined) return
		Promise.all(
			devices.map(async (device) =>
				api
					.project(project)
					.device(device)
					.history<GNSS>({
						path: [SensorProperties.GNSS, 'v'],
						limit: 1,
					})
					.then(([{ v, ts }]) => ({ position: v, device, ts })),
			),
		)
			.then(setPositions)
			.catch(console.error)
	}, [project, devices, api])

	return positions
}
