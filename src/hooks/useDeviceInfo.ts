import type { GoliothDevice } from 'api/api'
import type {
	Battery,
	DeviceHistoryDatum,
	DeviceInfo as Dev,
	Environment,
	GNSS,
	Roaming,
} from 'device/state'
import { useApi } from 'hooks/useApi'
import { useEffect, useState } from 'react'

type DeviceInfo = {
	bat?: DeviceHistoryDatum<Battery>
	env?: DeviceHistoryDatum<Environment>
	roam?: DeviceHistoryDatum<Roaming>
	gnss?: DeviceHistoryDatum<GNSS>
	dev?: DeviceHistoryDatum<Dev>
}

export const useDeviceInfo = ({
	device,
}: {
	device: GoliothDevice
}): DeviceInfo => {
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
