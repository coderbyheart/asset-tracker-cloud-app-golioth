import type { Device } from 'api/golioth'
import type { AssetConfig, AssetTwin } from 'asset/state'
import { useApi } from 'hooks/useApi'
import { useCurrentProject } from 'hooks/useCurrentProject'
import {
	createContext,
	FunctionComponent,
	useContext,
	useEffect,
	useState,
} from 'react'

export const CurrentDeviceContext = createContext<{
	device?: Device
	state?: AssetTwin
	updateDeviceSettings: (patch: { name: string }) => Promise<Device>
	updateAssetConfiguration: (patch: Partial<AssetConfig>) => Promise<void>
	setDeviceId: (deviceId?: string) => void
	setUpdateInterval: (interval: number) => void
}>({
	updateDeviceSettings: async () =>
		Promise.reject(new Error('[useCurrentDevice] update not possible.')),
	updateAssetConfiguration: async () =>
		Promise.reject(new Error('[useCurrentDevice] updateConfig not possible.')),
	setDeviceId: () => undefined,
	setUpdateInterval: () => undefined,
})

export const useCurrentDevice = () => useContext(CurrentDeviceContext)

export const CurrentDeviceProvider: FunctionComponent = ({ children }) => {
	const { project } = useCurrentProject()
	const [deviceId, setDeviceId] = useState<string>()
	const [currentDevice, setCurrentDevice] = useState<Device>()
	const [currentDeviceState, setCurrentDeviceState] = useState<AssetTwin>()
	const [updateInterval, setUpdateInterval] = useState<number>(5000)
	const api = useApi()

	// Load current device
	useEffect(() => {
		let isMounted = true
		if (project?.id === undefined) return
		if (deviceId === undefined) return
		if (currentDevice !== undefined) return // Already loaded
		const d = api.project({ id: project?.id }).device({ id: deviceId })
		Promise.all([d.state.get(), d.get()])
			.then(([state, device]) => {
				if (!isMounted) return
				setCurrentDevice(device)
				setCurrentDeviceState(state)
			})
			.catch(console.error)

		return () => {
			isMounted = false
		}
	}, [project, deviceId, currentDevice, api])

	// Auto-update the current device state
	useEffect(() => {
		let isMounted = true
		if (currentDevice === undefined) return
		if (updateInterval < 1000) return

		const updateState = async () => {
			if (currentDevice === undefined) return
			api
				.project({ id: currentDevice.projectId })
				.device({ id: currentDevice.id })
				.state.get()
				.then((state) => {
					if (!isMounted) return
					setCurrentDeviceState(state)
				})
				.catch(console.error)
		}

		console.debug(`[autoUpdateDeviceState]`, 'enabled', updateInterval)
		const interval = setInterval(updateState, updateInterval)
		return () => {
			console.debug(`[autoUpdateDeviceState]`, 'disabled')
			clearInterval(interval)
			isMounted = false
		}
	}, [currentDevice, api, updateInterval, setCurrentDeviceState])

	// Unload device data if deviceId is changed
	useEffect(() => {
		if (deviceId === undefined) {
			setCurrentDevice(undefined)
			setCurrentDeviceState(undefined)
		}
	}, [deviceId])

	const updateDeviceSettings = async (patch: {
		name: string
	}): Promise<Device> => {
		if (currentDevice === undefined)
			throw new Error(`[useCurrentDevice]: device not set`)
		return api
			.project({ id: currentDevice.projectId })
			.device({ id: currentDevice.id })
			.update(patch)
			.then((device) => {
				setCurrentDevice(device)
				return device
			})
	}
	const updateAssetConfiguration = async (
		patch: Partial<AssetConfig>,
	): Promise<void> => {
		if (currentDevice === undefined) {
			console.warn(`[updateAssetConfiguration]`, 'Asset not available.')
			return
		}
		if (currentDeviceState === undefined) {
			console.warn(`[updateAssetConfiguration]`, 'Asset state not available.')
			return
		}
		setCurrentDeviceState({
			...currentDeviceState,
			desired: {
				...currentDeviceState.desired,
				cfg: {
					...currentDeviceState.desired?.cfg,
					...patch,
				},
			},
		})
		await api
			.project({ id: currentDevice.projectId })
			.device({ id: currentDevice.id })
			.state.update({ cfg: patch })
	}
	return (
		<CurrentDeviceContext.Provider
			value={{
				setDeviceId,
				updateDeviceSettings,
				updateAssetConfiguration,
				setUpdateInterval,
				device: currentDevice,
				state: currentDeviceState,
			}}
		>
			{children}
		</CurrentDeviceContext.Provider>
	)
}
