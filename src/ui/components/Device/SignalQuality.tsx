import React from 'react'
import styled from 'styled-components'
import { RSRP, SignalQualityTriangle } from '@nordicsemiconductor/rsrp-bar'
import { emojify } from '../Emojify'

const StyledSignalQualityTriangle = styled(SignalQualityTriangle)`
	width: 20px;
	height: 20px;
	margin-right: 0.2rem;
`
export const SignalQuality = ({ dbm }: { dbm: number }) => (
	<RSRP
		dbm={dbm}
		renderBar={({ quality, dbm }) => (
			<>
				<StyledSignalQualityTriangle quality={quality} />
				<small>{`(${dbm}dBm)`}</small>
			</>
		)}
		renderInvalid={() => (
			<abbr title={`Unexpected value ${dbm} reported!`}>{emojify('❎')}</abbr>
		)}
	/>
)
