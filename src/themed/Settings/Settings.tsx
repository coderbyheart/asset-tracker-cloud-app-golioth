import type { AssetConfig } from 'asset/state'
import { DataModules } from 'asset/state'
import cx from 'classnames'
import { OutDatedWarning } from 'components/OutDatedWarning'
import equal from 'fast-deep-equal'
import { useAssetConfig } from 'golioth/hooks/useAssetConfig'
import React, { useState } from 'react'
import { emojify } from 'themed/Emojify'
import { NumberConfigSetting } from 'themed/Settings/NumberConfigSetting'
import styles from 'themed/Settings/Settings.module.css'

const MAX_INT32 = 2147483647

const buttonClass = (
	color: 'info' | 'success' | 'danger',
	outline: boolean,
): string =>
	cx('btn', {
		[`btn-${color}`]: !outline,
		[`btn-outline-${color}`]: outline,
	})

export const Settings = () => {
	const { reported: r, desired, update } = useAssetConfig()

	const [newDesired, setNewDesired] = useState<Partial<AssetConfig>>(desired)

	const hasChanges = !equal(newDesired, desired)

	const updateConfig = (cfg: Partial<AssetConfig>) => {
		const updated = {
			...newDesired,
			...cfg,
		}
		setNewDesired(updated)
	}

	const updateConfigProperty =
		(property: string, parser?: (v: string) => number) => (value: string) => {
			updateConfig({
				[property]: parser !== undefined ? parser(value) : parseInt(value, 10),
			})
		}

	const isActive =
		newDesired.act !== undefined ? newDesired.act === true : r.act === true

	return (
		<form className={styles.SettingsForm}>
			<fieldset data-intro={'This sets the operation mode of the asset.'}>
				<legend>Mode</legend>
				<div className="input-group mb-2">
					<div className="btn-group" role="group">
						<OutDatedWarning
							desired={newDesired.act}
							reported={r.act}
							onNotReported={
								<button
									type="button"
									className={'btn btn-danger'}
									disabled={true}
									title={'Asset has not reported this setting, yet.'}
								>
									{emojify('❓')}
								</button>
							}
							onOutDated={(current) => (
								<button
									type="button"
									className={'btn btn-outline-danger '}
									disabled={true}
									title={`Asset has an outdated value. Current value: ${JSON.stringify(
										current,
									)}.`}
								>
									{emojify('⭕')}
								</button>
							)}
						/>
						<button
							type="button"
							className={buttonClass('info', isActive)}
							data-intro={
								'In <em>Passive</em> mode, the asset will wait for movement (triggered by the accelerometer) before sending an update to the cloud.'
							}
							onClick={() => {
								updateConfig({ act: false })
							}}
						>
							Passive
						</button>
						<button
							type="button"
							className={buttonClass('success', !isActive)}
							data-intro={
								'In <em>Active</em> mode, the asset will send an update in a configurable interval.'
							}
							onClick={() => {
								updateConfig({ act: true })
							}}
						>
							Active
						</button>
					</div>
				</div>
			</fieldset>
			<fieldset data-intro={'How long to try to acquire a GPS fix.'}>
				<legend>GPS Timeout</legend>
				<NumberConfigSetting
					id={'gpst'}
					desired={newDesired.gpst}
					reported={r.gpst}
					example={60}
					onChange={updateConfigProperty('gpst')}
					minimum={1}
					maximum={MAX_INT32}
				/>
			</fieldset>
			<fieldset
				data-intro={'This configures the <em>passive</em> mode.'}
				style={{ gridRowEnd: 'span 2' }}
			>
				<legend>Passive Mode Settings</legend>
				<div className={styles.SideBySide}>
					<NumberConfigSetting
						label={'Movement Resolution'}
						intro={
							'After detecting movement send an update and wait this amount of time until movement again can trigger the next update.'
						}
						id={'mvres'}
						desired={newDesired.mvres}
						reported={r.mvres}
						onChange={updateConfigProperty('mvres')}
						minimum={1}
						maximum={MAX_INT32}
						example={300}
					/>
					<NumberConfigSetting
						label={'Movement Timeout'}
						intro={'Send updates to the cloud at least this often.'}
						id={'mvt'}
						example={3600}
						desired={newDesired.mvt}
						reported={r.mvt}
						onChange={updateConfigProperty('mvt')}
						minimum={1}
						maximum={MAX_INT32}
					/>
				</div>
				<NumberConfigSetting
					label={'Accelerometer threshold'}
					intro={
						'Minimal absolute value for an accelerometer reading to be considered movement. Range: 0 to 19.6133 m/s².'
					}
					id={'acct'}
					example={0.1}
					step={0.1}
					minimum={0}
					maximum={19.6133}
					unit={'m/s²'}
					desired={newDesired.acct}
					reported={r.acct}
					onChange={updateConfigProperty('acct', parseFloat)}
				/>
			</fieldset>
			<fieldset data-intro={'This configures the <em>active</em> mode.'}>
				<legend>Active Mode Settings</legend>
				<NumberConfigSetting
					label={'Active Wait Time'}
					intro={
						'Wait this amount of seconds until sending the next update. The actual interval will be this time plus the time it takes to get a GPS fix.'
					}
					id={'actwt'}
					desired={newDesired.actwt}
					reported={r.actwt}
					onChange={updateConfigProperty('actwt')}
					minimum={1}
					maximum={MAX_INT32}
					example={60}
				/>
			</fieldset>
			<fieldset data-intro={'This sets which Data Modules to sample.'}>
				<legend>Data Sampling</legend>
				<div className="input-group mb-2">
					<label className="form-label" htmlFor="nod-gps">
						GPS:
					</label>
					<div className="btn-group" role="group">
						<OutDatedWarning
							desired={newDesired.nod}
							reported={r.nod}
							onNotReported={
								<button
									type="button"
									className={'btn btn-danger'}
									disabled={true}
									title={'Asset has not reported this setting, yet.'}
									id="nod-gps"
								>
									{emojify('❓')}
								</button>
							}
							onOutDated={(current) => (
								<button
									type="button"
									className={'btn btn-outline-danger'}
									disabled={true}
									title={`Asset has an outdated value. Current value: ${JSON.stringify(
										current,
									)}.`}
								>
									{emojify('⭕')}
								</button>
							)}
							isEqual={(desired, reported) => {
								const ncellEnabled = desired.includes(DataModules.GNSS)
								return reported.includes(DataModules.GNSS) === ncellEnabled
							}}
						/>
						<button
							type="button"
							className={buttonClass(
								'success',
								newDesired.nod?.includes(DataModules.GNSS) ?? false,
							)}
							data-intro={
								'In <em>Enabled</em> mode, the asset will use GPS to send location data to the cloud.'
							}
							onClick={() => {
								updateConfig({
									nod: [...(newDesired.nod ?? [])].filter(
										(s) => s !== DataModules.GNSS,
									),
								})
							}}
						>
							Enabled
						</button>
						<button
							type="button"
							className={buttonClass(
								'danger',
								newDesired.nod === undefined ||
									!newDesired.nod?.includes(DataModules.GNSS),
							)}
							data-intro={
								'In <em>Disabled</em> mode, the asset will not use GPS to send location data to the cloud.'
							}
							onClick={() => {
								updateConfig({
									nod: [
										...new Set([...(newDesired.nod ?? []), DataModules.GNSS]),
									],
								})
							}}
						>
							Disabled
						</button>
					</div>
				</div>
				<div className="input-group mb-2">
					<label className="form-label" htmlFor="nod-ncell">
						Neighbor Cell Measurements:
					</label>
					<div className="btn-group" role="group">
						<OutDatedWarning
							desired={newDesired.nod}
							reported={r.nod}
							onNotReported={
								<button
									type="button"
									className={'btn btn-danger'}
									disabled={true}
									title={'Asset has not reported this setting, yet.'}
									id="nod-ncell"
								>
									{emojify('❓')}
								</button>
							}
							onOutDated={(current) => (
								<button
									type="button"
									className={'btn btn-outline-danger'}
									disabled={true}
									title={`Asset has an outdated value. Current value: ${JSON.stringify(
										current,
									)}.`}
								>
									{emojify('⭕')}
								</button>
							)}
							isEqual={(desired, reported) => {
								const ncellEnabled = desired.includes(
									DataModules.NeigboringCellMeasurements,
								)
								return (
									reported.includes(DataModules.NeigboringCellMeasurements) ===
									ncellEnabled
								)
							}}
						/>
						<button
							type="button"
							className={buttonClass(
								'success',
								newDesired.nod?.includes(
									DataModules.NeigboringCellMeasurements,
								) ?? false,
							)}
							data-intro={
								'In <em>Enabled</em> mode, the asset will use Neighbor Cell Measurements to send location data to the cloud.'
							}
							onClick={() => {
								updateConfig({
									nod: [...(newDesired.nod ?? [])].filter(
										(s) => s !== DataModules.NeigboringCellMeasurements,
									),
								})
							}}
						>
							Enabled
						</button>
						<button
							type="button"
							className={buttonClass(
								'danger',
								newDesired.nod === undefined ||
									!newDesired.nod?.includes(
										DataModules.NeigboringCellMeasurements,
									),
							)}
							data-intro={
								'In <em>Disabled</em> mode, the asset will not use Neighbor Cell Measurements to send location data to the cloud.'
							}
							onClick={() => {
								updateConfig({
									nod: [
										...new Set([
											...(newDesired.nod ?? []),
											DataModules.NeigboringCellMeasurements,
										]),
									],
								})
							}}
						>
							Disabled
						</button>
					</div>
				</div>
			</fieldset>

			<footer className={styles.FooterWithFullWidthButton}>
				<button
					type="button"
					className={'btn btn-primary'}
					disabled={!hasChanges}
					onClick={() => {
						update(newDesired).catch(console.error)
					}}
				>
					Update
				</button>
			</footer>
		</form>
	)
}
