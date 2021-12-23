export const objectFlagsToArray = (
	o?: Record<string, boolean> | null,
	trueFlag = true,
): string[] =>
	(o === undefined || o === null
		? []
		: Object.entries(o).filter(([, v]) => v === trueFlag)
	).map(([k]) => k)
