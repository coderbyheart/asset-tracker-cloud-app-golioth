import React from 'react'
import { useAuth } from '../golioth/hooks/useAuth'
import logo from './logo.svg'

export const Navbar = () => {
	const { isAuthenticated, logout } = useAuth()
	return (
		<nav
			className="navbar navbar-light"
			style={{
				background: 'linear-gradient(79.13deg,#2fe077,#61d2c9 48.78%,#6a70db)',
			}}
		>
			<div className="container">
				<a className="navbar-brand" href="#">
					<img
						src={logo}
						alt=""
						width="30"
						height="24"
						className="d-inline-block align-text-top"
					/>
					nRF Asset Tracker <small>(Golioth)</small>
				</a>
				{isAuthenticated && (
					<button type="button" className="btn btn-light" onClick={logout}>
						Log out
					</button>
				)}
			</div>
		</nav>
	)
}
