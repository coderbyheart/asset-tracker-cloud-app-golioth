import React, { useState } from 'react'
import classnames from 'classnames'

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
			className={classnames(
				{
					'toggle-on': toggled,
				},
				'toggle',
				className,
			)}
			onClick={toggle}
			data-toggled={toggled ? '1' : '0'}
		>
			{children}
		</div>
	)
}
