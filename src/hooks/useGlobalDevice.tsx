import React, {
	createContext,
	useContext,
	FunctionComponent,
	useState,
} from 'react'
import type { Device, DeviceState } from '../api/api'

export const GlobalDeviceContext = createContext<{
	info?: Device
	state?: DeviceState
	setDevice: (_?: { info?: Device; state?: DeviceState }) => void
}>({
	setDevice: () => undefined,
})

export const useGlobalDevice = () => useContext(GlobalDeviceContext)

export const GlobalDeviceProvider: FunctionComponent = ({ children }) => {
	const [device, setDevice] = useState<{
		info?: Device
		state?: DeviceState
	}>()
	return (
		<GlobalDeviceContext.Provider value={{ ...device, setDevice }}>
			{children}
		</GlobalDeviceContext.Provider>
	)
}
