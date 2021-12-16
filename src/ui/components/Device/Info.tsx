import { useGlobalDevice } from 'hooks/useGlobalDevice'
import React from 'react'
import { Toggle } from 'ui/components/Toggle'
import { emojify } from 'ui/components/Emojify'
import { ReportedTime } from 'ui/components/ReportedTime'
import { ConnectionInformation } from 'ui/components/Device/ConnectionInformation'
import type {
	Battery,
	Device,
	DeviceHistoryDatum,
	DeviceInfo,
	Environment,
	GNSS,
	Roaming,
} from 'api/api'
import { useDeviceInfo } from 'hooks/useDeviceInfo'
import styled from 'styled-components'

const Info = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	align-content: center;
	font-size: 85%;
	opacity: 0.75;
	> span:first-child {
		display: flex;
		> * {
			padding-right: 1rem;
		}
	}
	span.reportedTime {
		display: flex;
		font-size: 85%;
		opacity: 0.75;
		text-align: right;
		span.textWithIcon {
			width: auto;
			display: inline-block;
		}
	}
	padding: 0.5rem;
`

const StyledToggle = styled(Toggle)`
	& + & {
		border-top: 1px solid #dcdcdc;
	}
	.reportedTime {
		time {
			display: none;
		}
	}
	&.toggle-on {
		${Info} {
			.reportedTime {
				time {
					display: inline;
				}
			}
		}
	}
`

const RoamInfo = ({
	roam,
	dev,
}: {
	roam?: DeviceHistoryDatum<Roaming>
	dev?: DeviceHistoryDatum<DeviceInfo>
}) => {
	const { expectedSendIntervalInSeconds } = useGlobalDevice()
	if (roam === undefined) return null
	return (
		<StyledToggle>
			<Info>
				<ConnectionInformation
					mccmnc={roam.v.mccmnc}
					rsrp={roam.v.rsrp}
					reportedAt={new Date(roam.ts)}
					networkMode={roam?.v.nw}
					iccid={dev?.v.iccid}
					dataStaleAfterSeconds={expectedSendIntervalInSeconds}
				/>
			</Info>
		</StyledToggle>
	)
}

const BatteryInfo = ({ bat }: { bat?: DeviceHistoryDatum<Battery> }) => {
	const { expectedSendIntervalInSeconds } = useGlobalDevice()
	if (bat === undefined) return null

	return (
		<StyledToggle>
			<Info>
				<span>
					<span>{emojify(`🔋 ${bat.v / 1000}V`)}</span>
				</span>
				<ReportedTime
					reportedAt={new Date(bat.ts)}
					staleAfterSeconds={expectedSendIntervalInSeconds}
				/>
			</Info>
		</StyledToggle>
	)
}

const GNSSInfo = ({ gnss }: { gnss?: DeviceHistoryDatum<GNSS> }) => {
	const { expectedSendIntervalInSeconds } = useGlobalDevice()

	if (gnss?.v?.spd === undefined && gnss?.v?.alt === undefined) return null
	return (
		<StyledToggle>
			<Info>
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
			</Info>
		</StyledToggle>
	)
}

const EnvInfo = ({ env }: { env?: DeviceHistoryDatum<Environment> }) => {
	const { expectedSendIntervalInSeconds } = useGlobalDevice()

	if (
		env === undefined ||
		(env?.v.temp === undefined && env?.v.hum === undefined)
	)
		return null

	return (
		<StyledToggle>
			<Info>
				<span>
					{env.v.temp && <span>{emojify(`🌡️ ${env.v.temp}°C`)}</span>}
					{env.v.hum && <span>{emojify(`💦 ${Math.round(env.v.hum)}%`)}</span>}
				</span>
				<ReportedTime
					reportedAt={new Date(env.ts)}
					staleAfterSeconds={expectedSendIntervalInSeconds}
				/>
			</Info>
		</StyledToggle>
	)
}

export const InfoHeader = ({ device }: { device: Device }) => {
	const { bat, env, roam, gnss, dev } = useDeviceInfo({ device })

	return (
		<>
			<RoamInfo roam={roam} dev={dev} />
			<GNSSInfo gnss={gnss} />
			<BatteryInfo bat={bat} />
			<EnvInfo env={env} />
		</>
	)
}
