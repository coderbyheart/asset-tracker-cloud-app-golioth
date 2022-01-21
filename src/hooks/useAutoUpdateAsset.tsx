import { useApi } from 'hooks/useApi'
import { useCurrentDevice } from 'hooks/useCurrentDevice'
import { useEffect } from 'react'

export const useAutoUpdateAsset = (options?: { interval?: number }) => {
	const { device, setCurrentDevice: setAsset } = useCurrentDevice()
	const api = useApi()

	useEffect(() => {
		if (device === undefined) return

		const updateState = async () => {
			if (device === undefined) return
			api
				.project({ id: device.projectId })
				.device({ id: device.id })
				.state.get()
				.then((state) => {
					setAsset({ info: device, state })
				})
				.catch(console.error)
		}

		console.debug(`[useAutoUpdateAsset]`, 'enabled', options?.interval ?? 5000)
		const interval = setInterval(updateState, options?.interval ?? 5000)
		return () => {
			console.debug(`[useAutoUpdateAsset]`, 'disabled')
			clearInterval(interval)
		}
	}, [device, api, options, setAsset])
}
