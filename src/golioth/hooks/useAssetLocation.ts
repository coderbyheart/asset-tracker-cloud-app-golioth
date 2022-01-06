import type { GNSS } from 'asset/state'
import type { Device } from 'golioth/golioth'
import { useApi } from 'golioth/hooks/useApi'
import { SensorProperties } from 'golioth/hooks/useAssetHistory'
import { useAssets } from 'golioth/hooks/useAssets'
import { useCurrentProject } from 'golioth/hooks/useCurrentProject'
import { useEffect, useState } from 'react'

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
