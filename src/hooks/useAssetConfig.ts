import { defaultConfig } from 'asset/defaultConfig'
import type { AssetConfig } from 'asset/state'
import { useApi } from 'hooks/useApi'
import { useCurrentAsset } from './useCurrentAsset'

export const useAssetConfig = (): {
	update: (patch: Partial<AssetConfig>) => Promise<void>
	desired: Partial<AssetConfig>
	reported: Partial<AssetConfig>
} => {
	const { info: asset, state, setAsset } = useCurrentAsset()
	const api = useApi()
	const reported: Partial<AssetConfig> = state?.reported?.cfg ?? {}
	const desired: Partial<AssetConfig> = state?.desired?.cfg ?? {}

	return {
		update: async (patch: Partial<AssetConfig>): Promise<void> => {
			if (asset === undefined) {
				console.warn(`[useAssetConfig]`, 'Asset not available.')
				return
			}
			setAsset({
				info: asset,
				state: {
					...state,
					desired: {
						...state?.desired,
						cfg: {
							...defaultConfig,
							...state?.desired?.cfg,
							...patch,
						},
					},
				},
			})
			await api
				.project({ id: asset.projectId })
				.device({ id: asset.id })
				.state.update({ cfg: patch })
		},
		reported: {
			...defaultConfig,
			...reported,
		},
		desired: {
			...defaultConfig,
			...desired,
		},
	}
}
