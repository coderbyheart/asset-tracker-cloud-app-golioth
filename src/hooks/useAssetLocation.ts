import type { Device } from 'api/golioth'
import type { GNSS } from 'asset/state'
import { useApi } from 'hooks/useApi'
import { SensorProperties } from 'hooks/useAssetHistory'
import { useProject } from 'hooks/useProject'
import { useEffect, useState } from 'react'

type AssetLocation = {
	asset: Device
	position: GNSS
	ts: Date
}
export const useAssetLocations = (): AssetLocation[] => {
	const [positions, setPositions] = useState<AssetLocation[]>([])
	const { project, devices } = useProject()
	const api = useApi()

	useEffect(() => {
		if (project === undefined) return
		Promise.all(
			devices.map(async (asset) =>
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
	}, [project, devices, api])

	return positions
}
