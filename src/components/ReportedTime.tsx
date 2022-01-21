import {
	AlertIcon,
	ClockIcon,
	CloudIcon,
	IconWithText,
	OutdatedDataIcon,
} from 'components/FeatherIcon'
import { RelativeTime } from 'components/RelativeTime'
import { useReportedTime } from 'hooks/useReportedTime'
import type { HTMLProps } from 'react'

const OldWarning = ({
	reportIsOld,
	staleAfterSeconds,
}: {
	staleAfterSeconds: number
	reportIsOld: boolean
}) => {
	if (!reportIsOld) return null
	return (
		<abbr
			className="ps-1"
			title={`The asset is expected to report updates roughly every ${staleAfterSeconds} seconds, but the data is older.`}
		>
			<AlertIcon />
		</abbr>
	)
}

export const ReportedTime = ({
	reportedAt,
	receivedAt,
	staleAfterSeconds,
	...restProps
}: HTMLProps<HTMLSpanElement> & Parameters<typeof useReportedTime>[0]) => {
	const { reportedTimeIsOutDated, relativeTimesHaveDiff, reportIsOld } =
		useReportedTime({
			reportedAt,
			receivedAt,
			staleAfterSeconds,
		})
	return (
		<span className={'reportedTime'} {...restProps}>
			<IconWithText>
				{reportIsOld ? <OutdatedDataIcon /> : <ClockIcon />}
				<RelativeTime ts={reportedAt} key={reportedAt.toISOString()} />
				{staleAfterSeconds !== undefined && (
					<OldWarning
						reportIsOld={reportIsOld}
						staleAfterSeconds={staleAfterSeconds}
					/>
				)}
			</IconWithText>
			{receivedAt !== undefined &&
				reportedTimeIsOutDated &&
				relativeTimesHaveDiff && (
					<span className="ms-2">
						<IconWithText>
							<CloudIcon />
							<RelativeTime ts={receivedAt} key={receivedAt.toISOString()} />
						</IconWithText>
					</span>
				)}
		</span>
	)
}
