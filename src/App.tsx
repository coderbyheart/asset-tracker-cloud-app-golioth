import React from 'react'
import { AuthProvider, useAuth } from './golioth/hooks/useAuth'
import { ProjectsProvider } from './golioth/hooks/useProjects'
import { Devices } from './ui/Devices'
import { Login } from './ui/Login'
import { Navbar } from './ui/Navbar'

const AppRoot = () => {
	const { isAuthenticated } = useAuth()
	return (
		<>
			<header>
				<Navbar />
			</header>
			<main className="container mt-4">
				{!isAuthenticated && <Login />}
				{isAuthenticated && <Devices />}
			</main>
		</>
	)
}

export const App = () => (
	<ProjectsProvider>
		<AuthProvider>
			<AppRoot />
		</AuthProvider>
	</ProjectsProvider>
)
