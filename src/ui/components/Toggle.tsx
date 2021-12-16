import React, { useState } from 'react'

export const Toggle = ({
	children,
	className,
}: {
	children: React.ReactElement<any> | (React.ReactElement<any> | null)[]
	className?: string
}) => {
	const [toggled, setToggled] = useState(false)

	const toggle = () => {
		const state = !toggled
		setToggled(state)
	}

	return (
		<div
			className={`toggle ${toggled && 'toggle-on'} ${className}`}
			onClick={toggle}
		>
			{children}
		</div>
	)
}
