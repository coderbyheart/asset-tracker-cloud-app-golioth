import React from 'react'
import { RSRP, SignalQualityTriangle } from '@nordicsemiconductor/rsrp-bar'
import { emojify } from '../Emojify'

export const SignalQuality = ({ dbm }: { dbm: number }) => (
	<RSRP
		dbm={dbm}
		renderBar={({ quality, dbm }) => (
			<>
				<SignalQualityTriangle
					style={{
						width: '20px',
						height: '20px',
						marginRight: '0.2rem',
					}}
					quality={quality}
				/>
				<small>{`(${dbm}dBm)`}</small>
			</>
		)}
		renderInvalid={() => (
			<abbr title={`Unexpected value ${dbm} reported!`}>{emojify('❎')}</abbr>
		)}
	/>
)
