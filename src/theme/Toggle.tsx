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
			className={`${className} toggle`}
			onClick={toggle}
			data-toggled={toggled ? '1' : '0'}
		>
			{children}
		</div>
	)
}
