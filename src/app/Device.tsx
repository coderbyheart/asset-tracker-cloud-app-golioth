import type { GoliothDevice as ApiDevice } from 'api/api'
import type { DeviceTwin } from 'device/state'
import { useDevice } from 'hooks/useDevice'
import { useGlobalDevice } from 'hooks/useGlobalDevice'
import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { Collapsable } from 'theme/Collapsable'
import { Battery } from 'theme/Device/Battery'
import { DeviceInformation } from 'theme/Device/DeviceInformation'
import { InfoHeader } from 'theme/Device/Info'
import { Personalization } from 'theme/Device/Personalization'
import { Temperature } from 'theme/Device/Temperature'
import { emojify } from 'theme/Emojify'
import { MapWithSettings } from 'theme/Map/MapWithSettings'
import { Settings } from '../theme/Settings/Settings'

export const Device = () => {
	const { projectId, deviceId } = useParams()
	const { setDevice, info: device, state: deviceState } = useGlobalDevice()
	const { info, state } = useDevice({ projectId, deviceId })

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
							<MapWithSettings device={device} />
							<hr className="mt-0 mb-0" />
							<InfoHeader device={device} />
						</div>
					)}
					<div className="card-body">
						<Collapsable title={emojify('⚙️ Settings')} id="cat:settings">
							<h4>Personalization</h4>
							<Personalization device={device} />
							<h4 className="mt-4 ">Device configuration</h4>
							<Settings />
						</Collapsable>
						<Collapsable
							title={emojify('ℹ️ Device Information')}
							id="cat:information"
						>
							<DeviceInformation device={device} state={state} />
						</Collapsable>
						<Collapsable title={emojify('🔋 Battery')} id="cat:battery">
							<Battery device={device} />
						</Collapsable>
						<Collapsable title={emojify('🌡️ Temperature')} id="cat:temperature">
							<Temperature device={device} />
						</Collapsable>
					</div>
				</div>
			</div>
		</div>
	)
}
