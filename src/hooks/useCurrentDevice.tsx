import type { GoliothDevice } from 'api/api'
import type { DeviceTwin } from 'device/state'
import React, {
	createContext,
	FunctionComponent,
	useContext,
	useState,
} from 'react'

export const CurrentDeviceContext = createContext<{
	info?: GoliothDevice
	state?: DeviceTwin
	setDevice: (_?: { info?: GoliothDevice; state?: DeviceTwin }) => void
}>({
	setDevice: () => undefined,
})

export const useCurrentDevice = () => useContext(CurrentDeviceContext)

export const CurrentDeviceProvider: FunctionComponent = ({ children }) => {
	const [device, setDevice] = useState<{
		info?: GoliothDevice
		state?: DeviceTwin
	}>()

	return (
		<CurrentDeviceContext.Provider
			value={{
				...device,
				setDevice,
			}}
		>
			{children}
		</CurrentDeviceContext.Provider>
	)
}
