import React from 'react'
import { emojify } from 'ui/components/Emojify'

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
		{emojify('❌ No position known.')}
	</div>
)
