import { useEffect, useState } from 'react'
import type { Device, DeviceState } from '../api/api'
import { useApi } from './useApi'

export const useDevice = ({
	projectId,
	deviceId,
}: {
	projectId?: string
	deviceId?: string
}): {
	info?: Device
	state?: DeviceState
} => {
	const [{ info, state }, setDevice] = useState<{
		info?: Device
		state?: DeviceState
	}>({})
	const api = useApi()

	useEffect(() => {
		if (projectId === undefined || deviceId === undefined) return
		const d = api.project({ id: projectId }).device({ id: deviceId })
		Promise.all([d.state(), d.get()])
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
