import React from 'react'
import { useParams } from 'react-router'

export const Device = () => {
	const params = useParams()
	return <>{JSON.stringify(params)}</>
}
