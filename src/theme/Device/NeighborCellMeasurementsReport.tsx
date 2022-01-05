import type { GoliothDevice } from 'api/api'
import { expectedSendIntervalInSeconds } from 'device/expectedSendIntervalInSeconds'
import type { DeviceTwin, NCellMeasReport } from 'device/state'
import { useApi } from 'hooks/useApi'
import { useChartDateRange } from 'hooks/useChartDateRange'
import { useEffect, useState } from 'react'
import { ChartDateRange } from 'theme/ChartDateRange'
import styles from 'theme/Device/DeviceInformation.module.css'
import { ReportedTime } from 'theme/ReportedTime'
import { NoData } from './NoData'

export const NeighborCellMeasurementsReport = ({
	device,
	state,
}: {
	device: GoliothDevice
	state?: DeviceTwin
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
			.project({ id: device.projectId })
			.device({ id: device.id })
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
	}, [device, startDate, endDate, api])

	if (nCellMeasReport === undefined)
		return (
			<>
				<ChartDateRange />
				<NoData />
			</>
		)

	const report = nCellMeasReport.v

	return (
		<div className={styles.deviceInformation}>
			{(report.nmr?.length ?? 0) === 0 && (
				<NoData>No neighboring cells found.</NoData>
			)}
			{(report.nmr?.length ?? 0) > 0 && (
				<ol>
					{report.nmr?.map((cell, k) => (
						<li key={k}>
							<dl className={styles.DeviceInformation}>
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
