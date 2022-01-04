import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import type { GoliothProject } from '../api/api'
import { useDevices } from '../hooks/useDevices'
import { useProjects } from '../hooks/useProjects'

export const Devices = () => {
	const projects = useProjects()
	const [currentProject, setCurrentProject] = useState<GoliothProject>()
	if (projects.length > 0 && currentProject === undefined) {
		setCurrentProject(projects[0])
	}
	const devices = useDevices(currentProject)

	return (
		<main className="container">
			<div className="row justify-content-center">
				<div className="col-md-10 col-lg-8 col-xl-6">
					<div
						className="card"
						data-intro="This card lists the devices in your project. Click on one to see its details."
					>
						<div className="card-header d-flex align-items-center">
							<span className="me-4">Devices</span>
							<select
								className="form-select"
								aria-label="Select a project"
								value={currentProject?.id}
								onChange={() => undefined}
								data-intro="You can switch between the projects in your account here."
							>
								{projects.map((project) => (
									<option key={project.id} value={project.id}>
										{project.name}
									</option>
								))}
							</select>
						</div>
						<div className="card-body">
							{devices.map((device, key) => (
								<Link
									key={device.id}
									to={`/project/${currentProject?.id}/device/${device.id}`}
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
