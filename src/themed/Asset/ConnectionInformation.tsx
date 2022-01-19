import { identifyIssuer } from 'e118-iin-list'
import { isSome, none } from 'fp-ts/lib/Option'
import { filter as filterOperator, Operator as Op } from 'mcc-mnc-list'
import React from 'react'
import { SignalQuality } from 'themed/Asset/SignalQuality'
import { CellularIcon, IconWithText, SmartphoneIcon } from 'themed/FeatherIcon'
import { ReportedTime } from 'themed/ReportedTime'
import { TextWithIcon } from 'themed/TextWithIcon'

export const Operator = ({ op }: { op?: Op }) => (
	<span className={'operator'}>{op?.brand ?? 'Unknown'}</span>
)

export const ConnectionInformation = ({
	networkMode,
	rsrp,
	mccmnc,
	reportedAt,
	iccid,
	dataStaleAfterSeconds,
}: {
	networkMode?: string
	iccid?: string
	rsrp: number
	mccmnc: number
	reportedAt: Date
	dataStaleAfterSeconds: number
}) => {
	const maybeSimIssuer = iccid !== undefined ? identifyIssuer(iccid) : none
	return (
		<>
			<span>
				<TextWithIcon icon={SignalQuality({ dbm: rsrp })}>
					<>
						&nbsp;
						<Operator op={filterOperator({ mccmnc: `${mccmnc}` })[0]} />
					</>
				</TextWithIcon>
				<abbr title={'Network mode'}>
					<IconWithText>
						<CellularIcon size={16} />
						{networkMode ?? '?'}
					</IconWithText>
				</abbr>
				<abbr title={'SIM issuer'}>
					<IconWithText>
						<SmartphoneIcon size={16} />
						{isSome(maybeSimIssuer) ? maybeSimIssuer.value.companyName : '?'}
					</IconWithText>
				</abbr>
			</span>
			<ReportedTime
				reportedAt={reportedAt}
				staleAfterSeconds={dataStaleAfterSeconds}
			/>
		</>
	)
}
