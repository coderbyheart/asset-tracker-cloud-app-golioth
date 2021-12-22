import type { Device, DeviceState } from 'api/api'
import React from 'react'
import { ReportedTime } from 'ui/components/ReportedTime'

import styles from 'ui/components/DeviceInformation.module.css'
import { useDeviceInfo } from 'hooks/useDeviceInfo'
import { useExpectedSendIntervalInSeconds } from 'hooks/useGlobalDevice'

export const DeviceInformation = ({
	device,
	state,
}: {
	device: Device
	state?: DeviceState
}) => {
	const { roam, dev } = useDeviceInfo({ device })
	const expectedSendIntervalInSeconds = useExpectedSendIntervalInSeconds(state)
	if (dev === undefined) return null
	return (
		<div className={styles.deviceInformation}>
			<h4>Golioth</h4>
			<dl>
				<dt>Device ID</dt>
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
				staleAfterSeconds={expectedSendIntervalInSeconds}
			/>
		</div>
	)
}
