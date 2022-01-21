import { AssetInfo } from 'components/AssetInfo'
import { NoData } from 'components/NoData'
import { useCurrentDevice } from 'hooks/useCurrentDevice'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

export const Asset = () => {
	const { assetId } = useParams()
	const { device, state, setDeviceId } = useCurrentDevice()

	useEffect(() => {
		setDeviceId(assetId)
		return () => {
			setDeviceId()
		}
	}, [assetId, setDeviceId])

	if (device === undefined)
		return (
			<main className="container">
				<div className="row justify-content-center mb-4">
					<div className="col-md-10 col-lg-8 col-xl-6">
						<NoData />
					</div>
				</div>
			</main>
		)
	return <AssetInfo device={device} state={state} />
}
