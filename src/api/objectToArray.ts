export const objectToArray = (o?: Record<string, string> | null): string[] =>
	o === undefined || o === null ? [] : Object.values(o)
