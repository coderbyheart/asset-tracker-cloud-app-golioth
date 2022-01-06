import React from 'react'
import { emojify } from 'themed/Emojify'

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
		{emojify(`❌ ${children ?? 'No data.'}`)}
	</div>
)
