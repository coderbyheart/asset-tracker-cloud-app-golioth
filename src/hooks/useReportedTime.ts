import { formatDistanceToNow } from 'date-fns'

export const useReportedTime = ({
	reportedAt,
	receivedAt,
	staleAfterSeconds,
}: {
	reportedAt: Date
	receivedAt?: Date
	staleAfterSeconds?: number
}): {
	reportedTimeIsOutDated: boolean
	relativeTimesHaveDiff: boolean
	reportIsOld: boolean
} => {
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

	return {
		reportedTimeIsOutDated,
		relativeTimesHaveDiff,
		reportIsOld,
	}
}
