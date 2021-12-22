import React, {
	createContext,
	useContext,
	FunctionComponent,
	useState,
} from 'react'
import type { Device, DeviceState } from 'api/api'

const defaultExpectedIntervalInSeconds = 120

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
		<GlobalDeviceContext.Provider
			value={{
				...device,
				setDevice,
			}}
		>
			{children}
		</GlobalDeviceContext.Provider>
	)
}

/**
 * Calculate the interval in which the device is expected to publish data
 */
export const useExpectedSendIntervalInSeconds = (state?: DeviceState) =>
	(state?.reported?.cfg?.act ?? true // default device mode is active
		? state?.reported?.cfg?.actwt ?? defaultExpectedIntervalInSeconds // default active wait time is 120 seconds
		: state?.reported?.cfg?.mvt ?? 3600) + // default movement timeout is 3600
	(state?.reported?.cfg?.gpst ?? 60) + // default GPS timeout is 60 seconds
	60 // add 1 minute for sending and processing
