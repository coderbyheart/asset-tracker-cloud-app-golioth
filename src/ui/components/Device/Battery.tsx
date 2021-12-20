import React from 'react'
import { emojify } from 'ui/components/Emojify'
import { SensorProperties, useDeviceHistory } from 'hooks/useDeviceHistory'
import type { Device } from 'api/api'
import { HistoricalDataChart } from '../HistoricalDataChart'
import { ChartDateRange } from '../ChartDateRange'
import { useChartDateRange } from 'hooks/useChartDateRange'

export const Battery = ({ device }: { device: Device }) => {
	const { startDate, endDate } = useChartDateRange()
	const batteryHistory = useDeviceHistory({
		device,
		sensor: SensorProperties.Battery,
		startDate,
		endDate,
	})

	return (
		<div className="card mt-4">
			<div className="card-header">{emojify('🔋 Battery')}</div>
			<div className="card-body">
				<ChartDateRange />
				<HistoricalDataChart
					data={batteryHistory.map(({ v, ts }) => ({
						date: new Date(ts),
						value: v / 1000,
					}))}
					type="line"
				/>
			</div>
		</div>
	)
}
