import type { AssetTwin } from 'asset/state'

const defaultExpectedIntervalInSeconds = 120

/**
 * Calculate the interval in which the asset is expected to publish data
 */
export const expectedSendIntervalInSeconds = (state?: AssetTwin): number =>
	(state?.reported?.cfg?.act ?? true // default asset mode is active
		? state?.reported?.cfg?.actwt ?? defaultExpectedIntervalInSeconds // default active wait time is 120 seconds
		: state?.reported?.cfg?.mvt ?? 3600) + // default movement timeout is 3600
	(state?.reported?.cfg?.gpst ?? 60) + // default GPS timeout is 60 seconds
	60 // add 1 minute for sending and processing
