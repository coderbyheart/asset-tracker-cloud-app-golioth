import type { Device } from 'api/golioth'
import type { AssetTwin } from 'asset/state'
import { useApi } from 'hooks/useApi'
import { useEffect, useState } from 'react'

export const useDevice = ({
	projectId,
	deviceId,
}: {
	projectId?: string
	deviceId?: string
}): {
	device?: Device
	state?: AssetTwin
} => {
	const [{ device, state }, setAsset] = useState<{
		device?: Device
		state?: AssetTwin
	}>({})
	const api = useApi()

	useEffect(() => {
		if (projectId === undefined || deviceId === undefined) return
		const d = api.project({ id: projectId }).device({ id: deviceId })
		Promise.all([d.state.get(), d.get()])
			.then(([state, device]) => {
				setAsset({ state, device: { ...device, projectId } })
			})
			.catch(console.error)
	}, [projectId, deviceId, api])

	return {
		device: device,
		state,
	}
}
