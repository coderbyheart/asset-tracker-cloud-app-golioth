import type { Device } from 'api/golioth'
import type { AssetTwin } from 'asset/state'
import { useApi } from 'hooks/useApi'
import { useEffect, useState } from 'react'

export const useAsset = ({
	projectId,
	assetId,
}: {
	projectId?: string
	assetId?: string
}): {
	info?: Device
	state?: AssetTwin
} => {
	const [{ info, state }, setAsset] = useState<{
		info?: Device
		state?: AssetTwin
	}>({})
	const api = useApi()

	useEffect(() => {
		if (projectId === undefined || assetId === undefined) return
		const d = api.project({ id: projectId }).device({ id: assetId })
		Promise.all([d.state.get(), d.get()])
			.then(([state, info]) => {
				setAsset({ state, info: { ...info, projectId } })
			})
			.catch(console.error)
	}, [projectId, assetId, api])

	return {
		info,
		state,
	}
}
