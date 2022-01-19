import React from 'react'
import { IconWithText, XIcon } from 'themed/FeatherIcon'

export const NoMap = () => (
	<div
		style={{
			backgroundColor: '#ccc',
			display: 'flex',
			height: '250px',
			justifyContent: 'space-around',
			alignItems: 'center',
		}}
	>
		<IconWithText>
			<XIcon />
			No position known.
		</IconWithText>
	</div>
)
