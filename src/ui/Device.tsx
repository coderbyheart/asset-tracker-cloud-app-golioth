import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { useDevice } from 'hooks/useDevice'
import { emojify } from 'ui/components/Emojify'
import {
	useExpectedSendIntervalInSeconds,
	useGlobalDevice,
} from 'hooks/useGlobalDevice'
import type { Device as ApiDevice, DeviceState } from 'api/api'
import { Battery } from 'ui/components/Device/Battery'
import { Temperature } from 'ui/components/Device/Temperature'
import { MapWithSettings } from 'ui/components/Map/MapWithSettings'
import { InfoHeader } from 'ui/components/Device/Info'
import { Personalization } from 'ui/components/Personalization'
import { Collapsable } from 'ui/components/Collapsable'
import { DeviceInformation } from 'ui/components/DeviceInformation'

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
	state?: DeviceState
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
						<Collapsable
							title={emojify('⭐ Personalization')}
							id="cat:personalization"
						>
							<Personalization device={device} />
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
