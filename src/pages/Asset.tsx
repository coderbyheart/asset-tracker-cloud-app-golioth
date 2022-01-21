import type { Device as ApiAsset } from 'api/golioth'
import type { AssetTwin } from 'asset/state'
import { AssetInformation } from 'components/Asset/AssetInformation'
import { Battery } from 'components/Asset/Battery'
import { HistoricalButtonPresses } from 'components/Asset/HistoricalButtonPresses'
import { InfoHeader } from 'components/Asset/Info'
import { NeighborCellMeasurementsReport } from 'components/Asset/NeighborCellMeasurementsReport'
import { Personalization } from 'components/Asset/Personalization'
import { RSRP } from 'components/Asset/RSRP'
import { Temperature } from 'components/Asset/Temperature'
import { Collapsable } from 'components/Collapsable'
import {
	BatteryIcon,
	BellIcon,
	CellularIcon,
	CloudLightningIcon,
	IconWithText,
	InfoIcon,
	NeighboringCellsIcon,
	SettingsIcon,
	ThermometerIcon,
} from 'components/FeatherIcon'
import { MapWithSettings } from 'components/Map/MapWithSettings'
import { HelpNote } from 'components/Settings/HelpNote'
import { Settings } from 'components/Settings/Settings'
import { useAsset } from 'hooks/useAsset'
import { useAutoUpdateAsset } from 'hooks/useAutoUpdateAsset'
import { useCurrentAsset } from 'hooks/useCurrentAsset'
import React, { useEffect } from 'react'
import { useParams } from 'react-router'

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
							<Collapsable
								title={
									<IconWithText>
										<SettingsIcon size={22} />
										Settings
									</IconWithText>
								}
								id="cat:settings"
							>
								<h4>Personalization</h4>
								<Personalization asset={asset} />
								<div data-intro="This allows you change the run-time configuration of the asset.">
									<h4 className="mt-4 ">Asset configuration</h4>
									<HelpNote />
									<Settings />
								</div>
							</Collapsable>
							<Collapsable
								title={
									<IconWithText>
										<InfoIcon size={22} />
										Asset Information
									</IconWithText>
								}
								id="cat:information"
							>
								<AssetInformation asset={asset} state={state} />
							</Collapsable>
							<Collapsable
								title={
									<IconWithText>
										<CloudLightningIcon size={22} />
										Firmware Upgrade over-the-air (FOTA)
									</IconWithText>
								}
								id="cat:fota"
							>
								<div className="alert alert-info" role="alert">
									Manage the firmware of your asset through the{' '}
									<a
										href="https://console.golioth.io/"
										target="_blank"
										rel="nofollow noreferrer"
									>
										Golioth Console
									</a>
									.
								</div>
							</Collapsable>
							<Collapsable
								title={
									<IconWithText>
										<NeighboringCellsIcon size={22} />
										Neighboring cells
									</IconWithText>
								}
								id="cat:ncell"
							>
								<NeighborCellMeasurementsReport asset={asset} state={state} />
							</Collapsable>
							<Collapsable
								title={
									<IconWithText>
										<CellularIcon size={22} />
										RSRP
									</IconWithText>
								}
								id="cat:rsrp"
							>
								<RSRP asset={asset} />
							</Collapsable>
							<Collapsable
								title={
									<IconWithText>
										<BatteryIcon size={22} />
										Battery
									</IconWithText>
								}
								id="cat:battery"
							>
								<Battery asset={asset} />
							</Collapsable>
							<Collapsable
								title={
									<IconWithText>
										<ThermometerIcon size={22} />
										Temperature
									</IconWithText>
								}
								id="cat:temperature"
							>
								<Temperature asset={asset} />
							</Collapsable>
							<Collapsable
								title={
									<IconWithText>
										<BellIcon size={22} />
										Button
									</IconWithText>
								}
								id="cat:button"
							>
								<HistoricalButtonPresses asset={asset} />
							</Collapsable>
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}
