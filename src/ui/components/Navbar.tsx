import React from 'react'
import { Link } from 'react-router-dom'
import { useGlobalDevice } from '../../hooks/useGlobalDevice'
import { useAuth } from '../../hooks/useAuth'
import { emojify } from './Emojify'
import logo from './logo.svg'

export const Navbar = () => {
	const { isAuthenticated, logout } = useAuth()
	const { info } = useGlobalDevice()
	return (
		<nav
			className="navbar navbar-expand-lg navbar-light bg-light"
			style={{
				background: 'linear-gradient(79.13deg,#2fe077,#61d2c9 48.78%,#6a70db)',
			}}
		>
			<div className="container-fluid">
				<Link className="navbar-brand" to="/">
					<img
						src={logo}
						alt=""
						width="30"
						height="24"
						className="d-inline-block align-text-top"
					/>
					{info && <span>{info.name}</span>}
					{!info && (
						<span>
							nRF Asset Tracker <small>(Golioth)</small>
						</span>
					)}
				</Link>
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarTogglerDemo02"
					aria-controls="navbarTogglerDemo02"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarTogglerDemo02">
					<ul className="navbar-nav me-auto mb-2 mb-lg-0">
						<li className="nav-item">
							<Link className="nav-link" to="/devices">
								{emojify(`🐱 Devices`)}
							</Link>
						</li>
						<li className="nav-item">
							<Link className="nav-link" to="/about">
								{emojify(`💁 About`)}
							</Link>
						</li>
					</ul>

					{isAuthenticated && (
						<form className="d-flex">
							<button
								type="button"
								className="btn btn-outline-light"
								onClick={logout}
							>
								{emojify('🚪')} Log out
							</button>
						</form>
					)}
				</div>
			</div>
		</nav>
	)
}
