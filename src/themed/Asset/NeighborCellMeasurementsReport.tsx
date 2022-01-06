import { expectedSendIntervalInSeconds } from 'asset/expectedSendIntervalInSeconds'
import type { AssetTwin, NCellMeasReport } from 'asset/state'
import type { Device } from 'golioth/golioth'
import { useApi } from 'golioth/hooks/useApi'
import { useChartDateRange } from 'hooks/useChartDateRange'
import { useEffect, useState } from 'react'
import styles from 'themed/Asset/AssetInformation.module.css'
import { ChartDateRange } from 'themed/ChartDateRange'
import { NoData } from 'themed/NoData'
import { ReportedTime } from 'themed/ReportedTime'

export const NeighborCellMeasurementsReport = ({
	asset,
	state,
}: {
	asset: Device
	state?: AssetTwin
}) => {
	const { startDate, endDate } = useChartDateRange()
	const expectedInterval = expectedSendIntervalInSeconds(state)
	const api = useApi()
	const [nCellMeasReport, setNcellMeasReport] = useState<{
		v: NCellMeasReport
		ts: Date
	}>()

	useEffect(() => {
		api
			.project({ id: asset.projectId })
			.device({ id: asset.id })
			.history<NCellMeasReport>({
				path: ['ncellmeas'],
				limit: 1,
				startDate,
				endDate,
			})
			.then((res) => {
				setNcellMeasReport(res[0])
			})
			.catch(console.error)
	}, [asset, startDate, endDate, api])

	if (nCellMeasReport === undefined)
		return (
			<>
				<ChartDateRange />
				<NoData />
			</>
		)

	const report = nCellMeasReport.v

	return (
		<div className={styles.assetInformation}>
			{(report.nmr?.length ?? 0) === 0 && (
				<NoData>No neighboring cells found.</NoData>
			)}
			{(report.nmr?.length ?? 0) > 0 && (
				<ol>
					{report.nmr?.map((cell, k) => (
						<li key={k}>
							<dl className={styles.AssetInformation}>
								<dt>RSRP</dt>
								<dd>
									<code>{cell.rsrp}</code>
								</dd>
								<dt>RSRQ</dt>
								<dd>
									<code>{cell.rsrq}</code>
								</dd>
								<dt>CellID</dt>
								<dd>
									<code>{cell.cell}</code>
								</dd>
								<dt>EARFCN</dt>
								<dd>
									<code>{cell.earfcn}</code>
								</dd>
							</dl>
						</li>
					))}
				</ol>
			)}
			<ReportedTime
				reportedAt={nCellMeasReport.ts}
				staleAfterSeconds={expectedInterval}
			/>
		</div>
	)
}
