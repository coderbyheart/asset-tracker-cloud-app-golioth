import React from 'react'

export const About = ({
	version,
	homepage,
}: {
	version: string
	homepage: URL
}) => {
	return (
		<div className="row justify-content-center">
			<div className="col-lg-8">
				<div
					className="card"
					data-intro="Did you know that this application is open source? Check out the links!"
				>
					<div className="card-header">
						<h3 className="mt-2">About</h3>
					</div>
					<div className="card-body">
						<p>
							This is the web application of the <em>nRF Asset Tracker</em>{' '}
							which aims to provide a concrete end-to-end sample for an IoT
							product in the asset tracker space, a Cat Tracker. You can find
							the source code on{' '}
							<a
								href={homepage.toString()}
								target="_blank"
								rel="noopener noreferrer"
							>
								GitHub
							</a>
							.
						</p>
						<p>
							Please also consider the{' '}
							<a
								href={
									'https://nordicsemiconductor.github.io/asset-tracker-cloud-docs/'
								}
								target="_blank"
								rel="noopener noreferrer"
							>
								nRF Asset Tracker
							</a>{' '}
							documentation.
						</p>
						<dl>
							<dt>Version</dt>
							<dd>
								<code>{version}</code>
							</dd>
						</dl>
					</div>
				</div>
				<div className="card mt-4">
					<div className="card-header">
						<h3 className="mt-2">Environment</h3>
					</div>
					<div className="card-body">
						<dl>
							{Object.entries(import.meta.env).map(([k, v]) => (
								<React.Fragment key={k}>
									<dt>{k}</dt>
									<dd>
										<code>{v === undefined ? 'N/A' : JSON.stringify(v)}</code>
									</dd>
								</React.Fragment>
							))}
						</dl>
					</div>
				</div>
			</div>
		</div>
	)
}