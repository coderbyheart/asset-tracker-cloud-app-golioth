import { useCollapsed } from 'hooks/useCollapsed'
import React from 'react'
import styles from 'ui/components/Collapsable.module.css'

console.log(styles.collapsable)

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

	if (collapsed)
		return (
			<section className={styles.collapsable} aria-expanded="false">
				<header onClick={toggle}>
					<div>{title}</div>
					<button className="toggle" title={'Expand'} onClick={toggle}>
						<Chevron />
					</button>
				</header>
			</section>
		)

	return (
		<section className={styles.collapsable} aria-expanded="true">
			<header onClick={toggle}>
				<div>{title}</div>
				<button
					className="toggle"
					color={'link'}
					title={'Collapse'}
					onClick={toggle}
				>
					<Chevron />
				</button>
			</header>
			<div>{children}</div>
		</section>
	)
}
