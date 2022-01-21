import type { Device } from 'api/golioth'
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
import { ConnectionInformation } from 'components/Asset/ConnectionInformation'
import styles from 'components/Asset/Info.module.css'
import {
	AirplaneIcon,
	BatteryIcon,
	CloudIcon,
	CloudRainIcon,
	IconWithText,
	ThermometerIcon,
	TruckIcon,
} from 'components/FeatherIcon'
import { ReportedTime } from 'components/ReportedTime'
import { Toggle } from 'components/Toggle'
import { useAssetInfo } from 'hooks/useAssetInfo'

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
				<IconWithText>
					<BatteryIcon />
					{bat.v / 1000}V
				</IconWithText>
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
						<IconWithText>
							<TruckIcon />
							{Math.round(gnss.v.spd)}m/s
						</IconWithText>
					)}
					{gnss.v.alt !== undefined && (
						<IconWithText>
							<AirplaneIcon />
							{Math.round(gnss.v.alt)}m
						</IconWithText>
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
	if (env === undefined) return null

	return (
		<Toggle className={styles.assetInfoToggle}>
			<div className={styles.info}>
				<span>
					{env.v.temp && (
						<IconWithText>
							<ThermometerIcon />
							{env.v.temp}°C
						</IconWithText>
					)}
					{env.v.hum && (
						<IconWithText>
							<CloudRainIcon />
							{Math.round(env.v.hum)}%
						</IconWithText>
					)}
					{env.v.atmp && (
						<IconWithText>
							<CloudIcon />
							{Math.round(env.v.atmp * 10)}
						</IconWithText>
					)}
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
