import type { Device as ApiAsset } from 'api/golioth'
import type { AssetTwin } from 'asset/state'
import { useAsset } from 'hooks/useAsset'
import { useAutoUpdateAsset } from 'hooks/useAutoUpdateAsset'
import { useCurrentAsset } from 'hooks/useCurrentAsset'
import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { AssetInformation } from 'theme/Asset/AssetInformation'
import { Battery } from 'theme/Asset/Battery'
import { HistoricalButtonPresses } from 'theme/Asset/HistoricalButtonPresses'
import { InfoHeader } from 'theme/Asset/Info'
import { NeighborCellMeasurementsReport } from 'theme/Asset/NeighborCellMeasurementsReport'
import { Personalization } from 'theme/Asset/Personalization'
import { RSRP } from 'theme/Asset/RSRP'
import { Temperature } from 'theme/Asset/Temperature'
import { Collapsable } from 'theme/Collapsable'
import { emojify } from 'theme/Emojify'
import { MapWithSettings } from 'theme/Map/MapWithSettings'
import { HelpNote } from 'theme/Settings/HelpNote'
import { Settings } from '../theme/Settings/Settings'

export const Asset = () => {
	const { projectId, assetId } = useParams()
	const { setAsset, info: asset, state: assetState } = useCurrentAsset()
	const { info, state } = useAsset({ projectId, assetId })
	useAutoUpdateAsset()

	// Store the current asset globally
	useEffect(() => {
		setAsset({ info, state })
		return () => {
			setAsset()
		}
	}, [info, state, setAsset])

	if (asset === undefined) return null
	return <AssetInfo asset={asset} state={assetState} />
}

const AssetInfo = ({
	asset,
	state,
}: {
	asset: ApiAsset
	state?: AssetTwin
}) => {
	return (
		<main className="container">
			<div className="row justify-content-center mb-4">
				<div className="col-md-10 col-lg-8 col-xl-6">
					<div className="card">
						{state && (
							<div className="card-header pt-0 pe-0 pb-0 ps-0">
								<div data-intro="This map shows the location of your asset.">
									<MapWithSettings asset={asset} />
								</div>
								<hr className="mt-0 mb-0" />
								<div data-intro="This provides on overview of important asset information.">
									<InfoHeader asset={asset} />
								</div>
							</div>
						)}
						<div className="card-body">
							<Collapsable title={emojify('⚙️ Settings')} id="cat:settings">
								<h4>Personalization</h4>
								<Personalization asset={asset} />
								<div data-intro="This allows you change the run-time configuration of the asset.">
									<h4 className="mt-4 ">Asset configuration</h4>
									<HelpNote />
									<Settings />
								</div>
							</Collapsable>
							<Collapsable
								title={emojify('ℹ️ Asset Information')}
								id="cat:information"
							>
								<AssetInformation asset={asset} state={state} />
							</Collapsable>
							<Collapsable
								title={emojify('🗧 Neighboring cells')}
								id="cat:ncell"
							>
								<NeighborCellMeasurementsReport asset={asset} state={state} />
							</Collapsable>
							<Collapsable title={emojify('📶 RSRP')} id="cat:rsrp">
								<RSRP asset={asset} />
							</Collapsable>
							<Collapsable title={emojify('🔋 Battery')} id="cat:battery">
								<Battery asset={asset} />
							</Collapsable>
							<Collapsable
								title={emojify('🌡️ Temperature')}
								id="cat:temperature"
							>
								<Temperature asset={asset} />
							</Collapsable>
							<Collapsable title={emojify('🚨 Button')} id="cat:button">
								<HistoricalButtonPresses asset={asset} />
							</Collapsable>
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}
