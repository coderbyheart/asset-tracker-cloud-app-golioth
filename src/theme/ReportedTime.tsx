import { useReportedTime } from 'hooks/useReportedTime'
import React, { HTMLProps } from 'react'
import { emojify } from './Emojify'
import { RelativeTime } from './RelativeTime'

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
			title={`The device is expected to report updates roughly every ${staleAfterSeconds} seconds, but the data is older.`}
		>
			{emojify('⚠️')}
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
			{reportIsOld ? emojify('🤷 ') : emojify('🕒 ')}
			<RelativeTime ts={reportedAt} key={reportedAt.toISOString()} />
			{receivedAt !== undefined &&
				reportedTimeIsOutDated &&
				relativeTimesHaveDiff && (
					<span className="ms-2">
						{emojify('☁️ ')}
						<RelativeTime ts={receivedAt} key={receivedAt.toISOString()} />
					</span>
				)}
			{staleAfterSeconds !== undefined && (
				<OldWarning
					reportIsOld={reportIsOld}
					staleAfterSeconds={staleAfterSeconds}
				/>
			)}
		</span>
	)
}
