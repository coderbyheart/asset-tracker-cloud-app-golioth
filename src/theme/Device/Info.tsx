import type { GoliothDevice } from 'api/api'
import { expectedSendIntervalInSeconds } from 'device/expectedSendIntervalInSeconds'
import type {
	Battery,
	DeviceHistoryDatum,
	DeviceInfo,
	DeviceTwin,
	Environment,
	GNSS,
	Roaming,
} from 'device/state'
import { useDeviceInfo } from 'hooks/useDeviceInfo'
import React from 'react'
import { ConnectionInformation } from 'theme/Device/ConnectionInformation'
import { emojify } from 'theme/Emojify'
import { ReportedTime } from 'theme/ReportedTime'
import { Toggle } from 'theme/Toggle'
import styles from './Info.module.css'

const RoamInfo = ({
	roam,
	dev,
	expectedSendIntervalInSeconds,
}: {
	expectedSendIntervalInSeconds: number
	roam?: DeviceHistoryDatum<Roaming>
	dev?: DeviceHistoryDatum<DeviceInfo>
}) => {
	if (roam === undefined) return null
	return (
		<Toggle className={styles.deviceInfoToggle}>
			<div className={styles.info}>
				<ConnectionInformation
					mccmnc={roam.v.mccmnc}
					rsrp={roam.v.rsrp}
					reportedAt={new Date(roam.ts)}
					networkMode={roam?.v.nw}
					iccid={dev?.v.iccid}
					dataStaleAfterSeconds={expectedSendIntervalInSeconds}
				/>
			</div>
		</Toggle>
	)
}

const BatteryInfo = ({
	bat,
	expectedSendIntervalInSeconds,
}: {
	bat?: DeviceHistoryDatum<Battery>
	expectedSendIntervalInSeconds: number
}) => {
	if (bat === undefined) return null

	return (
		<Toggle className={styles.deviceInfoToggle}>
			<div className={styles.info}>
				<span>
					<span>{emojify(`🔋 ${bat.v / 1000}V`)}</span>
				</span>
				<ReportedTime
					reportedAt={new Date(bat.ts)}
					staleAfterSeconds={expectedSendIntervalInSeconds}
				/>
			</div>
		</Toggle>
	)
}

const GNSSInfo = ({
	gnss,
	expectedSendIntervalInSeconds,
}: {
	gnss?: DeviceHistoryDatum<GNSS>
	expectedSendIntervalInSeconds: number
}) => {
	if (gnss?.v?.spd === undefined && gnss?.v?.alt === undefined) return null
	return (
		<Toggle className={styles.deviceInfoToggle}>
			<div className={styles.info}>
				<span>
					{gnss.v.spd !== undefined && (
						<span>{emojify(` 🏃${Math.round(gnss.v.spd)}m/s`)}</span>
					)}
					{gnss.v.alt !== undefined && (
						<span>{emojify(`✈️ ${Math.round(gnss.v.alt)}m`)}</span>
					)}
				</span>
				<ReportedTime
					reportedAt={new Date(gnss.ts)}
					staleAfterSeconds={expectedSendIntervalInSeconds}
				/>
			</div>
		</Toggle>
	)
}

const EnvInfo = ({
	env,
	expectedSendIntervalInSeconds,
}: {
	env?: DeviceHistoryDatum<Environment>
	expectedSendIntervalInSeconds: number
}) => {
	if (
		env === undefined ||
		(env?.v.temp === undefined && env?.v.hum === undefined)
	)
		return null

	return (
		<Toggle className={styles.deviceInfoToggle}>
			<div className={styles.info}>
				<span>
					{env.v.temp && <span>{emojify(`🌡️ ${env.v.temp}°C`)}</span>}
					{env.v.hum && <span>{emojify(`💦 ${Math.round(env.v.hum)}%`)}</span>}
				</span>
				<ReportedTime
					reportedAt={new Date(env.ts)}
					staleAfterSeconds={expectedSendIntervalInSeconds}
				/>
			</div>
		</Toggle>
	)
}

export const InfoHeader = ({
	device,
	state,
}: {
	device: GoliothDevice
	state?: DeviceTwin
}) => {
	const { bat, env, roam, gnss, dev } = useDeviceInfo({ device })
	const expectedInterval = expectedSendIntervalInSeconds(state)

	return (
		<>
			<RoamInfo
				roam={roam}
				expectedSendIntervalInSeconds={expectedInterval}
				dev={dev}
			/>
			<GNSSInfo gnss={gnss} expectedSendIntervalInSeconds={expectedInterval} />
			<BatteryInfo bat={bat} expectedSendIntervalInSeconds={expectedInterval} />
			<EnvInfo env={env} expectedSendIntervalInSeconds={expectedInterval} />
		</>
	)
}
