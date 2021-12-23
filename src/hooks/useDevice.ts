import type { GoliothDevice } from 'api/api'
import type { DeviceTwin } from 'device/state'
import { useApi } from 'hooks/useApi'
import { useEffect, useState } from 'react'

export const useDevice = ({
	projectId,
	deviceId,
}: {
	projectId?: string
	deviceId?: string
}): {
	info?: GoliothDevice
	state?: DeviceTwin
} => {
	const [{ info, state }, setDevice] = useState<{
		info?: GoliothDevice
		state?: DeviceTwin
	}>({})
	const api = useApi()

	useEffect(() => {
		if (projectId === undefined || deviceId === undefined) return
		const d = api.project({ id: projectId }).device({ id: deviceId })
		Promise.all([d.state.get(), d.get()])
			.then(([state, info]) => {
				setDevice({ state, info: { ...info, projectId } })
			})
			.catch(console.error)
	}, [projectId, deviceId, api])

	return {
		info,
		state,
	}
}
