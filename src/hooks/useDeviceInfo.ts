import { useEffect, useState } from 'react'
import type {
	Battery,
	Device,
	DeviceHistoryDatum,
	DeviceInfo as Dev,
	DeviceSensor,
	Environment,
	GNSS,
	Roaming,
} from 'api/api'
import { useApi } from 'hooks/useApi'

type DeviceInfo = {
	bat?: DeviceHistoryDatum<Battery>
	env?: DeviceHistoryDatum<Environment>
	roam?: DeviceHistoryDatum<Roaming>
	gnss?: DeviceHistoryDatum<GNSS>
	dev?: DeviceHistoryDatum<Dev>
}

export const useDeviceInfo = ({ device }: { device: Device }): DeviceInfo => {
	const [history, setHistory] = useState<DeviceInfo>({})
	const api = useApi()

	useEffect(() => {
		api
			.project({ id: device.projectId })
			.device({ id: device.id })
			.multiHistory<{
				bat: Battery
				env: Environment
				roam: Roaming
				gnss: GNSS
				dev: Dev
			}>({ sensors: ['bat', 'env', 'roam', 'gnss', 'dev'] })
			.then(setHistory)
			.catch(console.error)
	}, [device, api])

	return history
}
