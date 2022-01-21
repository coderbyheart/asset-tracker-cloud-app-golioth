import type { Device } from 'api/golioth'
import { expectedSendIntervalInSeconds } from 'asset/expectedSendIntervalInSeconds'
import type { AssetTwin } from 'asset/state'
import styles from 'components/Asset/AssetInformation.module.css'
import { NoData } from 'components/NoData'
import { ReportedTime } from 'components/ReportedTime'
import { useAssetInfo } from 'hooks/useAssetInfo'
import React from 'react'

export const AssetInformation = ({
	device,
	state,
}: {
	device: Device
	state?: AssetTwin
}) => {
	const { roam, dev } = useAssetInfo({ asset: device })
	const expectedInterval = expectedSendIntervalInSeconds(state)
	if (dev === undefined) return <NoData />
	return (
		<div className={styles.assetInformation}>
			<h4>Golioth</h4>
			<dl>
				<dt>Asset ID</dt>
				<dd>
					<code>{device.id}</code>
				</dd>
				<dt>Project ID</dt>
				<dd>
					<code>{device.projectId}</code>
				</dd>
			</dl>
			<h4>Hard- and Software</h4>
			<dl>
				<dt>Board</dt>
				<dd>
					<code>{dev.v.brdV}</code>
				</dd>
				<dt>Modem</dt>
				<dd>
					<code>{dev.v.modV}</code>
				</dd>
				<dt>Application</dt>
				<dd>
					<abbr title="Golioth currently does not report the running firmware">
						<code>—</code>
					</abbr>
				</dd>
				<dt>IMEI</dt>
				<dd>
					<code>{dev.v.imei}</code>
				</dd>
			</dl>
			<h4>Connection</h4>
			<dl>
				<dt>ICCID</dt>
				<dd>
					<code>{dev.v.iccid}</code>
				</dd>
				{roam && (
					<>
						<dt>Band</dt>
						<dd>
							<code>{roam.v.band}</code>
						</dd>
						<dt>RSRP</dt>
						<dd>
							<code>{roam.v.rsrp}</code>
						</dd>
						<dt>MCC/MNC</dt>
						<dd>
							<code>{roam.v.mccmnc}</code>
						</dd>
						<dt>Area Code</dt>
						<dd>
							<code>{roam.v.area}</code>
						</dd>
						<dt>CellID</dt>
						<dd>
							<code>{roam.v.cell}</code>
						</dd>
						<dt>IP</dt>
						<dd>
							<code>{roam.v.ip}</code>
						</dd>
					</>
				)}
			</dl>
			<ReportedTime
				reportedAt={roam?.ts ?? dev.ts}
				staleAfterSeconds={expectedInterval}
			/>
		</div>
	)
}
