import type { Device } from 'api/golioth'
import { defaultConfig } from 'asset/defaultConfig'
import type { AssetConfig, AssetState, AssetTwin } from 'asset/state'
import React, {
	createContext,
	FunctionComponent,
	useContext,
	useState,
} from 'react'
import { useApi } from './useApi'

export const CurrentDeviceContext = createContext<{
	device?: Device
	state: {
		reported: AssetState & { cfg: AssetConfig }
		desired: AssetState & { cfg: AssetConfig }
	}
	setCurrentDevice: (_?: { info?: Device; state?: AssetTwin }) => void
	updateDeviceSettings: (patch: { name: string }) => Promise<Device>
	updateAssetConfiguration: (patch: Partial<AssetConfig>) => Promise<void>
}>({
	setCurrentDevice: () => undefined,
	updateDeviceSettings: async () =>
		Promise.reject(new Error('[useCurrentDevice] update not possible.')),
	updateAssetConfiguration: async () =>
		Promise.reject(new Error('[useCurrentDevice] updateConfig not possible.')),
	state: {
		reported: {
			cfg: defaultConfig,
		},
		desired: { cfg: defaultConfig },
	},
})

export const useCurrentDevice = () => useContext(CurrentDeviceContext)

export const CurrentDeviceProvider: FunctionComponent = ({ children }) => {
	const [currentDevice, setDevice] = useState<{
		device?: Device
		state?: AssetTwin
	}>()
	const api = useApi()
	const { device, state } = currentDevice ?? {}

	return (
		<CurrentDeviceContext.Provider
			value={{
				device,
				state: {
					reported: {
						...state?.reported,
						cfg: {
							...defaultConfig,
							...state?.reported?.cfg,
						},
					},
					desired: {
						...state?.desired,
						cfg: {
							...defaultConfig,
							...state?.desired?.cfg,
						},
					},
				},
				setCurrentDevice: setDevice,
				updateDeviceSettings: async (patch: {
					name: string
				}): Promise<Device> => {
					if (device === undefined)
						throw new Error(`[useCurrentDevice]: device not set`)
					return api
						.project({ id: device.projectId })
						.device({ id: device.id })
						.update(patch)
				},
				updateAssetConfiguration: async (
					patch: Partial<AssetConfig>,
				): Promise<void> => {
					if (device === undefined) {
						console.warn(`[useAssetConfig]`, 'Asset not available.')
						return
					}
					setDevice({
						device,
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
						.project({ id: device.projectId })
						.device({ id: device.id })
						.state.update({ cfg: patch })
				},
			}}
		>
			{children}
		</CurrentDeviceContext.Provider>
	)
}
