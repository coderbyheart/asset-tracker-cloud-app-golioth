import type { Device } from 'golioth/golioth'
import { useApi } from 'golioth/hooks/useApi'

export const useUpdateAsset = ({
	asset,
}: {
	asset: Device
}): ((_: { name: string }) => Promise<Device>) => {
	const api = useApi()
	return async (patch: { name: string }): Promise<Device> =>
		api.project({ id: asset.projectId }).device({ id: asset.id }).update(patch)
}
