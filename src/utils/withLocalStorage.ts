type WithLocalStorage = {
	<T>(key: string): {
		set: (_: T) => void
		get: () => T | undefined
		destroy: () => void
	}
	<T>(key: string, defaultValue: T): {
		set: (_: T) => void
		get: () => T
		destroy: () => void
	}
}

export const withLocalStorage: WithLocalStorage = <T>(
	key: string,
	defaultValue?: T,
): {
	set: (_: T) => void
	get: () => T | undefined
	destroy: () => void
} => {
	const destroy = () => localStorage.removeItem(key)
	return {
		set: (v?: T) => {
			if (v === undefined) destroy()
			localStorage.setItem(key, JSON.stringify(v))
		},
		get: () => {
			const stored = localStorage.getItem(key)
			if (stored === null) return defaultValue
			try {
				return JSON.parse(stored) as T
			} catch {
				console.error(
					`[withLocalStorage] Failed to load stored entry for ${key} from ${stored}!`,
				)
				return undefined
			}
		},
		destroy,
	}
}
