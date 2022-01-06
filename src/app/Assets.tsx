import { useCurrentProject } from 'hooks/useCurrentProject'
import React from 'react'
import { Link } from 'react-router-dom'
import { ProjectSelector } from 'theme/ProjectSelector'
import { useAssets } from '../hooks/useAssets'

export const Assets = () => {
	const { project } = useCurrentProject()
	const assets = useAssets(project)

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
						<div className="card-body">
							{assets.map((asset, key) => (
								<Link
									key={asset.id}
									to={`/project/${project?.id}/asset/${asset.id}`}
									data-intro={
										key === 0
											? `Click on a asset to view its details.`
											: undefined
									}
								>
									{asset.name}
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}
