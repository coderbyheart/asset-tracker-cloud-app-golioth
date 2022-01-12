import { expectedSendIntervalInSeconds } from 'asset/expectedSendIntervalInSeconds'
import type { AssetTwin } from 'asset/state'
import type { Device } from 'golioth/golioth'
import { useAssetInfo } from 'golioth/hooks/useAssetInfo'
import React from 'react'
import styles from 'themed/Asset/AssetInformation.module.css'
import { ReportedTime } from 'themed/ReportedTime'

export const AssetInformation = ({
	asset,
	state,
}: {
	asset: Device
	state?: AssetTwin
}) => {
	const { roam, dev } = useAssetInfo({ asset })
	const expectedInterval = expectedSendIntervalInSeconds(state)
	if (dev === undefined) return null
	return (
		<div className={styles.assetInformation}>
			<h4>Golioth</h4>
			<dl>
				<dt>Asset ID</dt>
				<dd>
					<code>{asset.id}</code>
				</dd>
				<dt>Project ID</dt>
				<dd>
					<code>{asset.projectId}</code>
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
