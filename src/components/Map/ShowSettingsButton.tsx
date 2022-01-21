import { ChevronDownIcon, SettingsIcon } from 'components/FeatherIcon'
import styles from 'components/Map/ShowSettingsButton.module.css'
import React, { useState } from 'react'

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
				<SettingsIcon />
				<ChevronDownIcon className={styles.chevron} />
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
			<SettingsIcon />
			<ChevronDownIcon className={styles.chevron} />
		</button>
	)
}
