import React, { useEffect, useState } from 'react'
import type { Device, Project } from 'src/golioth/api'
import { useApi } from '../golioth/hooks/useApi'
import { Link } from 'react-router-dom'

export const Devices = () => {
	const api = useApi()
	const [projects, setProjects] = useState<Project[]>([])
	const [devices, setDevices] = useState<Device[]>([])

	const [currentProject, setCurrentProject] = useState<Project>()
	if (projects.length > 0 && currentProject === undefined) {
		setCurrentProject(projects[0])
	}

	// Fetch projects
	useEffect(() => {
		let isMounted = true

		api
			.projects()
			.then((projects) => {
				if (isMounted) setProjects(projects)
			})
			.catch(console.error)

		return () => {
			isMounted = false
		}
	}, [api])

	// Fetch devices
	useEffect(() => {
		if (currentProject === undefined) return
		let isMounted = true

		api
			.project(currentProject)
			.devices()
			.then((devices) => {
				if (isMounted) setDevices(devices)
			})
			.catch(console.error)

		return () => {
			isMounted = false
		}
	}, [api, currentProject])

	return (
		<div className="row justify-content-center">
			<div className="col-md-6">
				<div className="card">
					<div className="card-header">
						<h3 className="mt-2">Devices</h3>
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
