import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { useDevice } from '../hooks/useDevice'
import { emojify } from './components/Emojify'
import { useGlobalDevice } from '../hooks/useGlobalDevice'
import type { Device as ApiDevice } from '../api/api'
import { Battery } from './components/Device/Battery'
import { Temperature } from './components/Device/Temperature'
import { MapWithSettings } from './components/Map/MapWithSettings'
import { InfoHeader } from './components/Device/Info'
import { Personalization } from './components/Personalization'
import { Collapsable } from './components/Collapsable'

export const Device = () => {
	const { projectId, deviceId } = useParams()
	const { setDevice, info: device } = useGlobalDevice()
	const { info, state } = useDevice({ projectId, deviceId })

	// Store the current device globally
	useEffect(() => {
		setDevice({ info, state })
		return () => {
			setDevice()
		}
	}, [info, state, setDevice])

	if (device === undefined) return null
	return <DeviceInfo device={device} />
}

const DeviceInfo = ({ device }: { device: ApiDevice }) => {
	const { state } = useGlobalDevice()
	return (
		<div className="row justify-content-center">
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
					</div>
				</div>

				<div className="card mt-4">
					<div className="card-header">{emojify('ℹ️ Device Information')}</div>
					<div className="card-body">
						<dl>
							<dt>Project ID</dt>
							<dd>{device.projectId}</dd>
						</dl>
						<dl>
							<dt>Device ID</dt>
							<dd>{device.id}</dd>
						</dl>
					</div>
				</div>

				<div className="card mt-4">
					<div className="card-header">Info</div>
					<div className="card-body">
						<pre>{JSON.stringify(device, null, 2)}</pre>
					</div>
				</div>

				{state && (
					<>
						<div className="card mt-4">
							<div className="card-header">Desired</div>
							<div className="card-body">
								<pre>{JSON.stringify(state?.desired, null, 2)}</pre>
							</div>
						</div>

						<div className="card mt-4">
							<div className="card-header">Reported</div>
							<div className="card-body">
								<pre>{JSON.stringify(state?.reported, null, 2)}</pre>
							</div>
						</div>
					</>
				)}

				<Battery device={device} />
				<Temperature device={device} />
			</div>
		</div>
	)
}
