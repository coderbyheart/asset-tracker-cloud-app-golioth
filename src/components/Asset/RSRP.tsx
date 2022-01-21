import type { Device } from 'api/golioth'
import { ChartDateRange } from 'components/ChartDateRange'
import { HistoricalDataChart } from 'components/HistoricalDataChart'
import { SensorProperties, useAssetHistory } from 'hooks/useAssetHistory'
import { useChartDateRange } from 'hooks/useChartDateRange'

export const RSRP = ({ asset }: { asset: Device }) => {
	const { startDate, endDate } = useChartDateRange()
	const RSRPHistory = useAssetHistory({
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
