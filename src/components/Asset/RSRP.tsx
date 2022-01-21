import type { Device } from 'api/golioth'
import { ChartDateRange } from 'components/ChartDateRange'
import { HistoricalDataChart } from 'components/HistoricalDataChart'
import { NoData } from 'components/NoData'
import { SensorProperties, useAssetHistory } from 'hooks/useAssetHistory'
import { useChartDateRange } from 'hooks/useChartDateRange'

export const RSRP = ({ asset }: { asset: Device }) => {
	const { startDate, endDate } = useChartDateRange()
	const RSRPHistory = useAssetHistory({
		sensor: SensorProperties.Roaming,
		startDate,
		endDate,
	})

	const data = RSRPHistory.map(({ v, ts }) => ({
		date: new Date(ts),
		value: v.rsrp,
	}))

	return (
		<>
			<ChartDateRange />
			{data.length === 0 ? (
				<NoData />
			) : (
				<HistoricalDataChart data={data} type="line" />
			)}
		</>
	)
}
