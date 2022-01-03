import type { GoliothDevice as ApiDevice } from 'api/api'
import type { DeviceTwin } from 'device/state'
import { useAutoUpdateDevice } from 'hooks/useAutoUpdateDevice'
import { useDevice } from 'hooks/useDevice'
import { useGlobalDevice } from 'hooks/useGlobalDevice'
import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { Collapsable } from 'theme/Collapsable'
import { Battery } from 'theme/Device/Battery'
import { DeviceInformation } from 'theme/Device/DeviceInformation'
import { HistoricalButtonPresses } from 'theme/Device/HistoricalButtonPresses'
import { InfoHeader } from 'theme/Device/Info'
import { NeighborCellMeasurementsReport } from 'theme/Device/NeighborCellMeasurementsReport'
import { Personalization } from 'theme/Device/Personalization'
import { RSRP } from 'theme/Device/RSRP'
import { Temperature } from 'theme/Device/Temperature'
import { emojify } from 'theme/Emojify'
import { MapWithSettings } from 'theme/Map/MapWithSettings'
import { HelpNote } from 'theme/Settings/HelpNote'
import { Settings } from '../theme/Settings/Settings'

export const Device = () => {
	const { projectId, deviceId } = useParams()
	const { setDevice, info: device, state: deviceState } = useGlobalDevice()
	const { info, state } = useDevice({ projectId, deviceId })
	useAutoUpdateDevice()

	// Store the current device globally
	useEffect(() => {
		setDevice({ info, state })
		return () => {
			setDevice()
		}
	}, [info, state, setDevice])

	if (device === undefined) return null
	return <DeviceInfo device={device} state={deviceState} />
}

const DeviceInfo = ({
	device,
	state,
}: {
	device: ApiDevice
	state?: DeviceTwin
}) => {
	return (
		<div className="row justify-content-center mb-4">
			<div className="col-md-10 col-lg-8 col-xl-6">
				<div className="card">
					{state && (
						<div className="card-header pt-0 pe-0 pb-0 ps-0">
							<div data-intro="This map shows the location of your device.">
								<MapWithSettings device={device} />
							</div>
							<hr className="mt-0 mb-0" />
							<div data-intro="This provides on overview of important device information.">
								<InfoHeader device={device} />
							</div>
						</div>
					)}
					<div className="card-body">
						<Collapsable title={emojify('⚙️ Settings')} id="cat:settings">
							<h4>Personalization</h4>
							<Personalization device={device} />
							<div data-intro="This allows you change the run-time configuration of the device.">
								<h4 className="mt-4 ">Device configuration</h4>
								<HelpNote />
								<Settings />
							</div>
						</Collapsable>
						<Collapsable
							title={emojify('ℹ️ Device Information')}
							id="cat:information"
						>
							<DeviceInformation device={device} state={state} />
						</Collapsable>
						<Collapsable title={emojify('🗧 Neighboring cells')} id="cat:ncell">
							<NeighborCellMeasurementsReport device={device} state={state} />
						</Collapsable>
						<Collapsable title={emojify('📶 RSRP')} id="cat:rsrp">
							<RSRP device={device} />
						</Collapsable>
						<Collapsable title={emojify('🔋 Battery')} id="cat:battery">
							<Battery device={device} />
						</Collapsable>
						<Collapsable title={emojify('🌡️ Temperature')} id="cat:temperature">
							<Temperature device={device} />
						</Collapsable>
						<Collapsable title={emojify('🚨 Button')} id="cat:button">
							<HistoricalButtonPresses device={device} />
						</Collapsable>
					</div>
				</div>
			</div>
		</div>
	)
}
