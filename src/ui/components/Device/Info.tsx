import { useGlobalDevice } from 'hooks/useGlobalDevice'
import React from 'react'
import { Toggle } from 'ui/components/Toggle'
import { emojify } from 'ui/components/Emojify'
import { ReportedTime } from 'ui/components/ReportedTime'
import { ConnectionInformation } from 'ui/components/ConnectionInformation'
import { SensorProperties, useDeviceHistory } from 'hooks/useDeviceHistory'
import type { Device } from 'api/api'

const RoamInfo = ({ device }: { device: Device }) => {
	const { expectedSendIntervalInSeconds } = useGlobalDevice()
	const roam = useDeviceHistory({
		device,
		sensor: SensorProperties.Roaming,
		limit: 1,
	}).pop()
	const dev: any = undefined
	if (roam === undefined) return null

	return (
		<Toggle>
			<ConnectionInformation
				mccmnc={roam.v.mccmnc}
				rsrp={roam.v.rsrp}
				reportedAt={new Date(roam.ts)}
				networkMode={roam?.v.nw}
				iccid={dev?.v.iccid}
				dataStaleAfterSeconds={expectedSendIntervalInSeconds}
			/>
		</Toggle>
	)
}

const BatteryInfo = ({ device }: { device: Device }) => {
	const { expectedSendIntervalInSeconds } = useGlobalDevice()
	const bat = useDeviceHistory({
		device,
		sensor: SensorProperties.Battery,
		limit: 1,
	}).pop()
	if (bat === undefined) return null

	return (
		<Toggle>
			<div className={'info'}>
				{emojify(`🔋 ${bat.v / 1000}V`)}
				<span />
				<ReportedTime
					reportedAt={new Date(bat.ts)}
					staleAfterSeconds={expectedSendIntervalInSeconds}
				/>
			</div>
		</Toggle>
	)
}

const GNSSInfo = ({ device }: { device: Device }) => {
	const { expectedSendIntervalInSeconds } = useGlobalDevice()
	const gnss = useDeviceHistory({
		device,
		sensor: SensorProperties.GNSS,
		limit: 1,
	}).pop()
	if (gnss?.v?.spd === undefined && gnss?.v?.alt === undefined) return null

	return (
		<Toggle>
			<div className={'info'}>
				{gnss.v.spd !== undefined && emojify(` 🏃${Math.round(gnss.v.spd)}m/s`)}
				{gnss.v.alt !== undefined && emojify(`✈️ ${Math.round(gnss.v.alt)}m`)}
				<ReportedTime
					reportedAt={new Date(gnss.ts)}
					staleAfterSeconds={expectedSendIntervalInSeconds}
				/>
			</div>
		</Toggle>
	)
}

const EnvInfo = ({ device }: { device: Device }) => {
	const { expectedSendIntervalInSeconds } = useGlobalDevice()
	const env = useDeviceHistory({
		device,
		sensor: SensorProperties.Environment,
		limit: 1,
	}).pop()
	if (env === undefined) return null

	return (
		<Toggle>
			<div className={'info'}>
				{emojify(`🌡️ ${env.v.temp}°C`)}
				{emojify(`💦 ${Math.round(env.v.hum)}%`)}
				<ReportedTime
					reportedAt={new Date(env.ts)}
					staleAfterSeconds={expectedSendIntervalInSeconds}
				/>
			</div>
		</Toggle>
	)
}

export const InfoHeader = ({ device }: { device: Device }) => (
	<>
		<RoamInfo device={device} />
		<GNSSInfo device={device} />
		<BatteryInfo device={device} />
		<EnvInfo device={device} />
	</>
)
