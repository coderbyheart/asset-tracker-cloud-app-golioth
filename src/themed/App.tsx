import { ApiProvider } from 'golioth/hooks/useApi'
import {
	AuthProvider,
	defaults as authContextDefaults,
	useAuth,
} from 'golioth/hooks/useAuth'
import { CurrentAssetProvider } from 'golioth/hooks/useCurrentAsset'
import { CurrentProjectProvider } from 'golioth/hooks/useCurrentProject'
import { ProjectsProvider } from 'golioth/hooks/useProjects'
import { CurrentChartDateRangeProvider } from 'hooks/useChartDateRange'
import React from 'react'
import {
	BrowserRouter as Router,
	Navigate,
	Route,
	Routes,
} from 'react-router-dom'
import { AssetsMap } from 'themed/Map/AssetsMap'
import { Navbar } from 'themed/Navbar'
import { About } from 'themed/page/About'
import { Asset } from 'themed/page/Asset'
import { Assets } from 'themed/page/Assets'
import { Login } from 'themed/page/Login'

const PUBLIC_API_ENDPOINT = new URL(
	(
		import.meta.env.PUBLIC_API_ENDPOINT ?? 'https://api.golioth.io/v1/'
	)?.replace(/\/$/, ''),
)

const AppRoot = () => {
	const isAuthenticated =
		useAuth().isAuthenticated ?? authContextDefaults.isAuthenticated
	const jwtKey = useAuth().jwtKey ?? authContextDefaults.jwtKey

	return (
		<Router basename={import.meta.env.BASE_URL ?? '/'}>
			<Navbar />

			{!isAuthenticated && (
				<Routes>
					<Route index element={<Navigate to="/login" />} />
					<Route path="/login" element={<Login />} />
				</Routes>
			)}
			{isAuthenticated && jwtKey !== undefined && (
				<ApiProvider jwtKey={jwtKey} endpoint={PUBLIC_API_ENDPOINT}>
					<ProjectsProvider>
						<CurrentProjectProvider>
							<CurrentAssetProvider>
								<CurrentChartDateRangeProvider>
									<Routes>
										<Route path="/login" element={<Navigate to="/assets" />} />
										<Route path="/" element={<Navigate to="/assets" />} />
										<Route path="/assets" element={<Assets />} />
										<Route path="/map" element={<AssetsMap />} />
										<Route
											path="/project/:projectId/asset/:assetId"
											element={<Asset />}
										/>
									</Routes>
								</CurrentChartDateRangeProvider>
							</CurrentAssetProvider>
						</CurrentProjectProvider>
					</ProjectsProvider>
				</ApiProvider>
			)}
			<Routes>
				<Route
					path="/about"
					element={
						<About
							version={import.meta.env.PUBLIC_VERSION ?? '0.0.0-development'}
							homepage={
								new URL(
									import.meta.env.PUBLIC_HOMEPAGE ??
										'https://github.com/NordicSemiconductor/asset-tracker-cloud-app-golioth-js',
								)
							}
						/>
					}
				/>
			</Routes>
		</Router>
	)
}

export const App = () => (
	<AuthProvider apiEndpoint={PUBLIC_API_ENDPOINT}>
		<AppRoot />
	</AuthProvider>
)
