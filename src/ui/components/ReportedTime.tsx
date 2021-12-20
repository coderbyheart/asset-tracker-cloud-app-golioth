import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { RelativeTime } from './RelativeTime'
import { emojify } from './Emojify'

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
}: {
	reportedAt: Date
	receivedAt?: Date
	staleAfterSeconds?: number
}) => {
	const reportedTimeIsOutDated =
		receivedAt === undefined
			? false
			: (receivedAt.getTime() - reportedAt.getTime()) / 1000 > 300
	const relativeTimesHaveDiff =
		receivedAt === undefined
			? false
			: formatDistanceToNow(receivedAt, {
					includeSeconds: true,
					addSuffix: true,
			  }) !==
			  formatDistanceToNow(reportedAt, {
					includeSeconds: true,
					addSuffix: true,
			  })
	const reportIsOld =
		(Date.now() - reportedAt.getTime()) / 1000 >
		(staleAfterSeconds ?? Number.MAX_SAFE_INTEGER)
	try {
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
	} catch {
		return (
			<span className={'reportedTime'} {...restProps}>
				{emojify('☁️ ')}
				{receivedAt !== undefined && (
					<RelativeTime ts={receivedAt} key={receivedAt.toISOString()} />
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
}
