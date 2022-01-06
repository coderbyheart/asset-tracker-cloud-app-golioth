import type { Device } from 'api/golioth'
import type {
	AssetHistoryDatum,
	AssetInfo as Dev,
	Battery,
	Environment,
	GNSS,
	Roaming,
} from 'asset/state'
import { useApi } from 'hooks/useApi'
import { useEffect, useState } from 'react'

type AssetInfo = {
	bat?: AssetHistoryDatum<Battery>
	env?: AssetHistoryDatum<Environment>
	roam?: AssetHistoryDatum<Roaming>
	gnss?: AssetHistoryDatum<GNSS>
	dev?: AssetHistoryDatum<Dev>
}

export const useAssetInfo = ({ asset }: { asset: Device }): AssetInfo => {
	const [history, setHistory] = useState<AssetInfo>({})
	const api = useApi()

	useEffect(() => {
		api
			.project({ id: asset.projectId })
			.device({ id: asset.id })
			.multiHistory<{
				bat: Battery
				env: Environment
				roam: Roaming
				gnss: GNSS
				dev: Dev
			}>({ sensors: ['bat', 'env', 'roam', 'gnss', 'dev'] })
			.then(setHistory)
			.catch(console.error)
	}, [asset, api])

	return history
}
