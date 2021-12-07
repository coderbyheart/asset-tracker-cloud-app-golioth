import React, { useEffect, useState } from 'react'
import { useAuth } from '../golioth/hooks/useAuth'
import { Device, useProjects } from '../golioth/hooks/useProjects'

export const Devices = () => {
	const { jwtKey } = useAuth()
	const { projects, currentProject, project } = useProjects()
	const selectedProjectId = currentProject?.id ?? projects[0]?.id
	const selectedProject = projects.find(({ id }) => id === selectedProjectId)
	const [devices, setDevices] = useState<Device[]>([])

	useEffect(() => {
		if (selectedProject === undefined) return
		if (jwtKey === undefined) return
		let isMounted = true

		project(selectedProject)
			.devices(jwtKey)
			.then((devices) => {
				if (isMounted) setDevices(devices)
			})

		return () => {
			isMounted = false
		}
	}, [selectedProject, jwtKey])

	return (
		<div className="row justify-content-center">
			<div className="col-md-6">
				<div className="card">
					<div className="card-header">
						Devices
						<select
							className="form-select"
							aria-label="Select a project"
							value={selectedProjectId}
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
							<p key={device.id}>{device.name}</p>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
