import type { GoliothDevice } from 'api/api'
import { useApi } from 'hooks/useApi'

export const useUpdateDevice = ({
	device,
}: {
	device: GoliothDevice
}): ((_: { name: string }) => Promise<GoliothDevice>) => {
	const api = useApi()
	return async (patch: { name: string }): Promise<GoliothDevice> =>
		api
			.project({ id: device.projectId })
			.device({ id: device.id })
			.update(patch)
}
