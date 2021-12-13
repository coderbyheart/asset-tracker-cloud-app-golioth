import React from 'react'
import { emojify } from 'ui/components/Emojify'
import { SensorProperties, useDeviceHistory } from 'hooks/useDeviceHistory'
import type { Device } from 'api/api'
import { HistoricalDataChart } from '../HistoricalDataChart'
import { ChartDateRange } from '../ChartDateRange'
import { useChartDateRange } from 'hooks/useChartDateRange'

export const Temperature = ({ device }: { device: Device }) => {
	const { startDate, endDate } = useChartDateRange()
	const TemperatureHistory = useDeviceHistory({
		device,
		sensor: SensorProperties.Environment,
		startDate,
		endDate,
	})

	return (
		<div className="card mt-4">
			<div className="card-header">
				<h3 className="mt-2">{emojify('🌡️ Temperature')}</h3>
			</div>
			<div className="card-body">
				<ChartDateRange />
				<HistoricalDataChart
					data={TemperatureHistory.map(({ v, ts }) => ({
						date: new Date(ts),
						value: v.temp,
					}))}
					type="line"
				/>
			</div>
		</div>
	)
}
