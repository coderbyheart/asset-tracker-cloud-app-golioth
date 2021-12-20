import { useCollapsed } from 'hooks/useCollapsed'
import React from 'react'
import 'ui/components/Collapsable.css'

const Chevron = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="square"
		stroke-linejoin="square"
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
			<div className="collapsable" data-collapsed={collapsed ? '1' : '0'}>
				<div className="collapsableHeader" onClick={toggle}>
					<div>{title}</div>
					<button className="toggle" title={'Expand'} onClick={toggle}>
						<Chevron />
					</button>
				</div>
			</div>
		)

	return (
		<div className="collapsable" data-collapsed={collapsed ? '1' : '0'}>
			<div className="collapsableHeader" onClick={toggle}>
				<div>{title}</div>
				<button
					className="toggle"
					color={'link'}
					title={'Collapse'}
					onClick={toggle}
				>
					<Chevron />
				</button>
			</div>
			<div className="collapsableContent">{children}</div>
		</div>
	)
}
