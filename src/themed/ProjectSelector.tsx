import { useCurrentProject } from 'golioth/hooks/useCurrentProject'
import { useProjects } from 'golioth/hooks/useProjects'
import React from 'react'

export const ProjectSelector = () => {
	const projects = useProjects()
	const { project } = useCurrentProject()

	return (
		<form className="project-selector">
			<select
				className="form-select"
				aria-label="Select a project"
				value={project?.id}
				onChange={() => undefined}
				data-intro="You can switch between the projects in your account here."
			>
				<option disabled>Select your project:</option>
				{projects.map((project) => (
					<option key={project.id} value={project.id}>
						{project.name}
					</option>
				))}
			</select>
		</form>
	)
}
