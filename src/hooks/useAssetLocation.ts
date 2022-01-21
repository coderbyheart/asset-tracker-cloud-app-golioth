import type { Device } from 'api/golioth'
import type { GNSS } from 'asset/state'
import { useApi } from 'hooks/useApi'
import { SensorProperties } from 'hooks/useAssetHistory'
import { useCurrentProject } from 'hooks/useCurrentProject'
import { useDevices } from 'hooks/useDevices'
import { useEffect, useState } from 'react'

type AssetLocation = {
	asset: Device
	position: GNSS
	ts: Date
}
export const useAssetLocations = (): AssetLocation[] => {
	const [positions, setPositions] = useState<AssetLocation[]>([])
	const { project } = useCurrentProject()
	const assets = useDevices()
	const api = useApi()

	useEffect(() => {
		if (project === undefined) return
		Promise.all(
			assets.map(async (asset) =>
				api
					.project(project)
					.device(asset)
					.history<GNSS>({
						path: [SensorProperties.GNSS, 'v'],
						limit: 1,
					})
					.then(([{ v, ts }]) => ({ position: v, asset, ts })),
			),
		)
			.then(setPositions)
			.catch(console.error)
	}, [project, assets, api])

	return positions
}
