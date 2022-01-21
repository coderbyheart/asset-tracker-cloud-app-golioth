import React from 'react'
import { IconWithText, XIcon } from './FeatherIcon'

export const NoData = ({ children }: { children?: string }) => (
	<div
		style={{
			backgroundColor: '#eee',
			borderRadius: '5px',
			display: 'flex',
			height: '50px',
			justifyContent: 'space-around',
			alignItems: 'center',
		}}
	>
		<IconWithText>
			<XIcon />
			{children ?? 'No data.'}
		</IconWithText>
	</div>
)
