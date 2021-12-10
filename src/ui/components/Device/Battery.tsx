import React from 'react'
import { emojify } from '../Emojify'
import {
	SensorProperties,
	useDeviceHistory,
} from '../../../hooks/useDeviceHistory'
import type { Device } from '../../../api/api'

export const Battery = ({ device }: { device: Device }) => {
	const batteryHistory = useDeviceHistory({
		device,
		sensor: SensorProperties.Battery,
	})

	return (
		<div className="card mt-4">
			<div className="card-header">
				<h3 className="mt-2">{emojify('🔋 Battery')}</h3>
			</div>
			<div className="card-body">
				<pre>{JSON.stringify(batteryHistory, null, 2)}</pre>
			</div>
		</div>
	)
}
