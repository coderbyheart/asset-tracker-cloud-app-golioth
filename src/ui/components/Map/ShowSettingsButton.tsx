import React, { useState } from 'react'
import { emojify } from 'ui/components/Emojify'

import styles from 'ui/components/Map/ShowSettingsButton.module.css'

export const ShowSettingsButton = ({
	onToggle,
}: {
	onToggle?: (collapsed: boolean) => void
}) => {
	const [collapsed, setCollapsed] = useState(true)

	const toggle = () => {
		const state = !collapsed
		setCollapsed(state)
		onToggle?.(state)
	}

	if (collapsed)
		return (
			<button
				type="button"
				title={'Expand'}
				onClick={toggle}
				aria-expanded="false"
				className={styles.showSettingsButton}
			>
				{emojify('⚙️')}
				<span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<polyline points="6 9 12 15 18 9"></polyline>
					</svg>
				</span>
			</button>
		)

	return (
		<button
			type="button"
			color={'link'}
			title={'Collapse'}
			onClick={toggle}
			aria-expanded="true"
			className={styles.showSettingsButton}
		>
			{emojify('⚙️')}
			<span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<polyline points="18 15 12 9 6 15"></polyline>
				</svg>
			</span>
		</button>
	)
}
