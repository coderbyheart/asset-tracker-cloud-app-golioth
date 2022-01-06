import { expectedSendIntervalInSeconds } from 'asset/expectedSendIntervalInSeconds'
import type {
	AssetHistoryDatum,
	AssetInfo,
	AssetTwin,
	Battery,
	Environment,
	GNSS,
	Roaming,
} from 'asset/state'
import type { Device } from 'golioth/golioth'
import { useAssetInfo } from 'golioth/hooks/useAssetInfo'
import React from 'react'
import { ConnectionInformation } from 'themed/Asset/ConnectionInformation'
import { emojify } from 'themed/Emojify'
import styles from 'themed/Info.module.css'
import { ReportedTime } from 'themed/ReportedTime'
import { Toggle } from 'themed/Toggle'

const RoamInfo = ({
	roam,
	dev,
	expectedSendIntervalInSeconds,
}: {
	expectedSendIntervalInSeconds: number
	roam?: AssetHistoryDatum<Roaming>
	dev?: AssetHistoryDatum<AssetInfo>
}) => {
	if (roam === undefined) return null
	return (
		<Toggle className={styles.assetInfoToggle}>
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
	bat?: AssetHistoryDatum<Battery>
	expectedSendIntervalInSeconds: number
}) => {
	if (bat === undefined) return null

	return (
		<Toggle className={styles.assetInfoToggle}>
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
	gnss?: AssetHistoryDatum<GNSS>
	expectedSendIntervalInSeconds: number
}) => {
	if (gnss?.v?.spd === undefined && gnss?.v?.alt === undefined) return null
	return (
		<Toggle className={styles.assetInfoToggle}>
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
	env?: AssetHistoryDatum<Environment>
	expectedSendIntervalInSeconds: number
}) => {
	if (
		env === undefined ||
		(env?.v.temp === undefined && env?.v.hum === undefined)
	)
		return null

	return (
		<Toggle className={styles.assetInfoToggle}>
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
	asset,
	state,
}: {
	asset: Device
	state?: AssetTwin
}) => {
	const { bat, env, roam, gnss, dev } = useAssetInfo({ asset })
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
