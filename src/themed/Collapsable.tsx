import { useCollapsed } from 'hooks/useCollapsed'
import React from 'react'
import styles from 'themed/Collapsable.module.css'

const Chevron = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="square"
		strokeLinejoin="miter"
	>
		<polyline points="6 9 12 15 18 9"></polyline>
	</svg>
)

export const Collapsable = ({
	id,
	title,
	children,
}: {
	id: string
	title: React.ReactElement<any>
	children: React.ReactElement<any> | (React.ReactElement<any> | null)[]
}) => {
	const { collapsed, toggle } = useCollapsed(id)

	const handleKey = (e: React.KeyboardEvent<HTMLElement>) => {
		if (e.code === 'Enter') {
			e.stopPropagation()
			e.preventDefault()
			toggle()
		}
	}

	const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.stopPropagation()
		e.preventDefault()
		toggle()
	}

	if (collapsed)
		return (
			<section className={styles.collapsable} id={id}>
				<header
					onClick={handleClick}
					role={'button'}
					tabIndex={0}
					onKeyDown={handleKey}
					aria-expanded="false"
				>
					<div>{title}</div>
					<Chevron />
				</header>
			</section>
		)

	return (
		<section className={styles.collapsable}>
			<header
				onClick={handleClick}
				role={'button'}
				tabIndex={0}
				onKeyDown={handleKey}
				aria-expanded="true"
			>
				<div>{title}</div>
				<Chevron />
			</header>
			<div>{children}</div>
		</section>
	)
}
