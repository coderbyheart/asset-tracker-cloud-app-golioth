import type { Device } from 'golioth/golioth'
import {
	SensorProperties,
	useAssetHistory,
} from 'golioth/hooks/useAssetHistory'
import { useChartDateRange } from 'hooks/useChartDateRange'
import React from 'react'
import { ChartDateRange } from 'themed/ChartDateRange'
import { HistoricalDataChart } from 'themed/HistoricalDataChart'

export const RSRP = ({ asset }: { asset: Device }) => {
	const { startDate, endDate } = useChartDateRange()
	const RSRPHistory = useAssetHistory({
		asset,
		sensor: SensorProperties.Roaming,
		startDate,
		endDate,
	})

	return (
		<>
			<ChartDateRange />
			<HistoricalDataChart
				data={RSRPHistory.map(({ v, ts }) => ({
					date: new Date(ts),
					value: v.rsrp,
				}))}
				type="line"
			/>
		</>
	)
}
