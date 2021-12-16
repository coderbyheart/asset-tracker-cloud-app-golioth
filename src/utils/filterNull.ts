export const filterNull = (
	o: Record<string, null | unknown>,
): Record<string, unknown> =>
	Object.entries(o)
		.filter(([, v]) => v !== null)
		.reduce((o, [k, v]) => {
			return {
				...o,
				[k]:
					typeof v === 'object' && !Array.isArray(v)
						? filterNull(v as Record<string, unknown>)
						: v,
			}
		}, {})
