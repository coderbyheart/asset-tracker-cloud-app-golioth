import type { Device } from 'api/api'
import { useApi } from 'hooks/useApi'

export const useDeviceUpdate = ({
	device,
}: {
	device: Device
}): ((_: { name: string }) => Promise<Device>) => {
	const api = useApi()
	return async (patch: { name: string }): Promise<Device> =>
		api
			.project({ id: device.projectId })
			.device({ id: device.id })
			.update(patch)
}
