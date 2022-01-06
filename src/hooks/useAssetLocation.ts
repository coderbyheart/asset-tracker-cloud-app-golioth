import type { Device } from 'api/golioth'
import type { GNSS } from 'asset/state'
import { useEffect, useState } from 'react'
import { useApi } from './useApi'
import { SensorProperties } from './useAssetHistory'
import { useAssets } from './useAssets'
import { useCurrentProject } from './useCurrentProject'

type AssetLocation = {
	asset: Device
	position: GNSS
	ts: Date
}
export const useAssetLocations = (): AssetLocation[] => {
	const [positions, setPositions] = useState<AssetLocation[]>([])

	const { project } = useCurrentProject()
	const assets = useAssets(project)
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
