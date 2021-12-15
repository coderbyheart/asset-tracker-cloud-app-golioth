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
	expectedSendIntervalInSeconds: number
}>({
	setDevice: () => undefined,
	expectedSendIntervalInSeconds: defaultExpectedIntervalInSeconds,
})

export const useGlobalDevice = () => useContext(GlobalDeviceContext)

export const GlobalDeviceProvider: FunctionComponent = ({ children }) => {
	const [device, setDevice] = useState<{
		info?: Device
		state?: DeviceState
	}>()
	// Calculate the interval in which the device is expected to publish data
	const expectedSendIntervalInSeconds =
		(device?.state?.reported?.cfg?.act ?? true // default device mode is active
			? device?.state?.reported?.cfg?.actwt ?? defaultExpectedIntervalInSeconds // default active wait time is 120 seconds
			: device?.state?.reported?.cfg?.mvt ?? 3600) + // default movement timeout is 3600
		(device?.state?.reported?.cfg?.gpst ?? 60) + // default GPS timeout is 60 seconds
		60 // add 1 minute for sending and processing

	return (
		<GlobalDeviceContext.Provider
			value={{ ...device, setDevice, expectedSendIntervalInSeconds }}
		>
			{children}
		</GlobalDeviceContext.Provider>
	)
}
