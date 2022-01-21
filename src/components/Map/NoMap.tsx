import { IconWithText, XIcon } from 'components/FeatherIcon'
import React from 'react'

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
