import React, { useState } from 'react'
import type { Project } from '../api/api'
import { Link } from 'react-router-dom'
import { useProjects } from '../hooks/useProjects'
import { useDevices } from '../hooks/useDevices'

export const Devices = () => {
	const projects = useProjects()
	const [currentProject, setCurrentProject] = useState<Project>()
	if (projects.length > 0 && currentProject === undefined) {
		setCurrentProject(projects[0])
	}
	const devices = useDevices(currentProject)

	return (
		<div className="row justify-content-center">
			<div className="col-md-10 col-lg-8 col-xl-6">
				<div className="card">
					<div className="card-header d-flex align-items-center">
						<span className="me-4">Devices</span>
						<select
							className="form-select"
							aria-label="Select a project"
							value={currentProject?.id}
							onChange={() => undefined}
						>
							{projects.map((project) => (
								<option key={project.id} value={project.id}>
									{project.name}
								</option>
							))}
						</select>
					</div>
					<div className="card-body">
						{devices.map((device) => (
							<Link
								key={device.id}
								to={`/project/${currentProject?.id}/device/${device.id}`}
							>
								{device.name}
							</Link>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
