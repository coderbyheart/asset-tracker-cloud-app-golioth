import type { Device } from 'api/golioth'
import { expectedSendIntervalInSeconds } from 'asset/expectedSendIntervalInSeconds'
import type { AssetTwin, NCellMeasReport } from 'asset/state'
import styles from 'components/Asset/AssetInformation.module.css'
import { ChartDateRange } from 'components/ChartDateRange'
import { NoData } from 'components/NoData'
import { ReportedTime } from 'components/ReportedTime'
import { useApi } from 'hooks/useApi'
import { useChartDateRange } from 'hooks/useChartDateRange'
import { useEffect, useState } from 'react'

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
		let isMounted = true
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
				if (!isMounted) return
				setNcellMeasReport(res[0])
			})
			.catch(console.error)
		return () => {
			isMounted = false
		}
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
