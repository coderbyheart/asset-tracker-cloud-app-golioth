import { useApi } from 'hooks/useApi'
import { useEffect } from 'react'
import { useGlobalDevice } from './useGlobalDevice'

export const useAutoUpdateDevice = (options?: { interval?: number }) => {
	const { info: device, state, setDevice } = useGlobalDevice()
	const api = useApi()

	const updateState = async () => {
		if (device === undefined) return
		api
			.project({ id: device.projectId })
			.device({ id: device.id })
			.state.get()
			.then((state) => {
				setDevice({ info: device, state })
			})
			.catch(console.error)
	}

	useEffect(() => {
		if (device === undefined) return
		console.debug(`[useAutoUpdateDevice]`, 'enabled', options?.interval ?? 5000)
		const interval = setInterval(updateState, options?.interval ?? 5000)
		return () => {
			console.debug(`[useAutoUpdateDevice]`, 'disabled')
			clearInterval(interval)
		}
	}, [device, updateState])
}
