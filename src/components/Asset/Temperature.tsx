import type { Device } from 'api/golioth'
import { ChartDateRange } from 'components/ChartDateRange'
import { HistoricalDataChart } from 'components/HistoricalDataChart'
import { SensorProperties, useAssetHistory } from 'hooks/useAssetHistory'
import { useChartDateRange } from 'hooks/useChartDateRange'
import React from 'react'

export const Temperature = ({ asset }: { asset: Device }) => {
	const { startDate, endDate } = useChartDateRange()
	const TemperatureHistory = useAssetHistory({
		sensor: SensorProperties.Environment,
		startDate,
		endDate,
	})

	return (
		<>
			<ChartDateRange />
			<HistoricalDataChart
				data={TemperatureHistory.map(({ v, ts }) => ({
					date: new Date(ts),
					value: v.temp,
				}))}
				type="line"
			/>
		</>
	)
}
