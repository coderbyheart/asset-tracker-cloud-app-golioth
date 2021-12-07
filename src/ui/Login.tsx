import React, { useState, useEffect } from 'react'
import { useAuth } from '../golioth/hooks/useAuth'

export const Login = () => {
	const [id, setId] = useState<string>('')
	const [secret, setSecret] = useState<string>('')
	const isValid = id.length > 20 && secret.length > 20
	const { login } = useAuth()
	const [loggingIn, setLoggingIn] = useState(false)

	useEffect(() => {
		let isMounted = true
		if (!isValid) return
		if (!loggingIn) return
		login({ id, secret })
			.catch(console.error.bind('[Login]'))
			.finally(() => {
				isMounted && setLoggingIn(false)
			})
		return () => {
			isMounted = false
		}
	}, [isValid, loggingIn, id, secret])

	return (
		<div className="row justify-content-center">
			<div className="col-md-6">
				<form>
					<div className="mb-3">
						<label htmlFor="jwtKey" className="form-label">
							JWT key
						</label>
						<input
							type="text"
							className="form-control"
							id="jwtKey"
							aria-describedby="jwtKeyHelp"
							value={id}
							disabled={loggingIn}
							onChange={({ target: { value } }) => setId(value)}
						/>
						<div id="jwtKeyHelp" className="form-text">
							The identifier of your Golioth API JWT key.
						</div>
					</div>
					<div className="mb-3">
						<label htmlFor="jwtSecret" className="form-label">
							JWT secret
						</label>
						<input
							type="password"
							className="form-control"
							id="jwtSecret"
							aria-describedby="jwtSecretHelp"
							value={secret}
							disabled={loggingIn}
							onChange={({ target: { value } }) => setSecret(value)}
						/>
						<div id="jwtSecretHelp" className="form-text">
							The secret of your Golioth API JWT key.
						</div>
					</div>
					<button
						type="button"
						className="btn btn-primary"
						disabled={!isValid || loggingIn}
						onClick={() => {
							setLoggingIn(true)
						}}
					>
						Log in
					</button>
				</form>
			</div>
		</div>
	)
}
