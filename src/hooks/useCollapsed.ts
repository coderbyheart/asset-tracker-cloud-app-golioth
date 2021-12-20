import { useState } from 'react'
import { withLocalStorage } from 'utils/withLocalStorage'

export const useCollapsed = (
	id: string,
): {
	collapsed: boolean
	toggle: () => void
} => {
	const storedCollapsed = withLocalStorage<boolean>({
		key: id,
		defaultValue: true,
	})

	const [collapsed, setCollapsed] = useState<boolean>(storedCollapsed.get())

	const toggle = () => {
		const state = !collapsed
		setCollapsed(state)
		storedCollapsed.set(state)
	}

	return {
		collapsed,
		toggle,
	}
}
