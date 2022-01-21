import { NoData } from 'components/NoData'
import { ProjectSelector } from 'components/ProjectSelector'
import { useDevices } from 'hooks/useDevices'
import { Link } from 'react-router-dom'

export const Assets = () => {
	const devices = useDevices()

	return (
		<main className="container">
			<div className="row justify-content-center">
				<div className="col-md-10 col-lg-8 col-xl-6">
					<div
						className="card"
						data-intro="This card lists the assets in your project. Click on one to see its details."
					>
						<div className="card-header d-flex align-items-center justify-content-between">
							<span className="me-4">Assets</span>
							<ProjectSelector />
						</div>
						{devices.length === 0 && (
							<div className="card-body">
								<NoData />
							</div>
						)}
						{devices.length > 0 && (
							<table className="table">
								<tbody>
									{devices.map((device, key) => (
										<tr key={device.id}>
											<td>
												<Link
													to={`/project/${device.projectId}/asset/${device.id}`}
													data-intro={
														key === 0
															? `Click on a asset to view its details.`
															: undefined
													}
												>
													{device.name}
												</Link>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
					</div>
				</div>
			</div>
		</main>
	)
}
