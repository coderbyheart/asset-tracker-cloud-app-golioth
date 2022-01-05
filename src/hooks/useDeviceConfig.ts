import { defaultConfig } from 'device/defaultConfig'
import type { DeviceConfig } from 'device/state'
import { useApi } from 'hooks/useApi'
import { useCurrentDevice } from './useCurrentDevice'

export const useDeviceConfig = (): {
	update: (patch: Partial<DeviceConfig>) => Promise<void>
	desired: Partial<DeviceConfig>
	reported: Partial<DeviceConfig>
} => {
	const { info: device, state, setDevice } = useCurrentDevice()
	const api = useApi()
	const reported: Partial<DeviceConfig> = state?.reported?.cfg ?? {}
	const desired: Partial<DeviceConfig> = state?.desired?.cfg ?? {}

	return {
		update: async (patch: Partial<DeviceConfig>): Promise<void> => {
			if (device === undefined) {
				console.warn(`[useDeviceConfig]`, 'Device not available.')
				return
			}
			setDevice({
				info: device,
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
