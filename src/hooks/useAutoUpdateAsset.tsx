import { useApi } from 'hooks/useApi'
import { useEffect } from 'react'
import { useCurrentAsset } from './useCurrentAsset'

export const useAutoUpdateAsset = (options?: { interval?: number }) => {
	const { info: asset, setAsset } = useCurrentAsset()
	const api = useApi()

	useEffect(() => {
		if (asset === undefined) return

		const updateState = async () => {
			if (asset === undefined) return
			api
				.project({ id: asset.projectId })
				.device({ id: asset.id })
				.state.get()
				.then((state) => {
					setAsset({ info: asset, state })
				})
				.catch(console.error)
		}

		console.debug(`[useAutoUpdateAsset]`, 'enabled', options?.interval ?? 5000)
		const interval = setInterval(updateState, options?.interval ?? 5000)
		return () => {
			console.debug(`[useAutoUpdateAsset]`, 'disabled')
			clearInterval(interval)
		}
	}, [asset, api, options, setAsset])
}
