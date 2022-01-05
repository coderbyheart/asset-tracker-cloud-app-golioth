import { useCurrentProject } from 'hooks/useCurrentProject'
import React from 'react'
import { Link } from 'react-router-dom'
import { ProjectSelector } from 'theme/ProjectSelector'
import { useDevices } from '../hooks/useDevices'

export const Devices = () => {
	const { project } = useCurrentProject()
	const devices = useDevices(project)

	return (
		<main className="container">
			<div className="row justify-content-center">
				<div className="col-md-10 col-lg-8 col-xl-6">
					<div
						className="card"
						data-intro="This card lists the devices in your project. Click on one to see its details."
					>
						<div className="card-header d-flex align-items-center justify-content-between">
							<span className="me-4">Devices</span>
							<ProjectSelector />
						</div>
						<div className="card-body">
							{devices.map((device, key) => (
								<Link
									key={device.id}
									to={`/project/${project?.id}/device/${device.id}`}
									data-intro={
										key === 0
											? `Click on a device to view its details.`
											: undefined
									}
								>
									{device.name}
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}
