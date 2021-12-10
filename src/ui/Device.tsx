import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { useDevice } from '../hooks/useDevice'
import { emojify } from './components/Emojify'
import { Map } from './components/Map/Map'
import { useGlobalDevice } from '../hooks/useGlobalDevice'
import type { Device as ApiDevice } from '../api/api'
import { Battery } from './components/Device/Battery'

export const Device = () => {
	const { projectId, deviceId } = useParams()
	const { setDevice } = useGlobalDevice()
	const { info, state } = useDevice({ projectId, deviceId })

	// Store the current device globally
	useEffect(() => {
		setDevice({ info, state })
		return () => {
			setDevice()
		}
	}, [info, state, setDevice])

	if (info === undefined) return null
	return <DeviceInfo device={info} />
}

const DeviceInfo = ({ device }: { device: ApiDevice }) => {
	const { info, state } = useGlobalDevice()
	return (
		<div className="row justify-content-center">
			<div className="col-lg-8">
				{info && state && <Map device={info} />}

				<div className="card mt-4">
					<div className="card-header">
						<h3 className="mt-2">{emojify('ℹ️ Device Information')}</h3>
					</div>
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

				{info && (
					<div className="card mt-4">
						<div className="card-header">
							<h3 className="mt-2">Info</h3>
						</div>
						<div className="card-body">
							<pre>{JSON.stringify(info, null, 2)}</pre>
						</div>
					</div>
				)}

				{state && (
					<>
						<div className="card mt-4">
							<div className="card-header">
								<h3 className="mt-2">Desired</h3>
							</div>
							<div className="card-body">
								<pre>{JSON.stringify(state?.desired, null, 2)}</pre>
							</div>
						</div>

						<div className="card mt-4">
							<div className="card-header">
								<h3 className="mt-2">Reported</h3>
							</div>
							<div className="card-body">
								<pre>{JSON.stringify(state?.reported, null, 2)}</pre>
							</div>
						</div>
					</>
				)}

				<Battery device={device} />
			</div>
		</div>
	)
}
