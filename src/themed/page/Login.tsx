import { useAuth } from 'golioth/hooks/useAuth'
import React, { useEffect, useState } from 'react'

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
	}, [isValid, loggingIn, id, secret, login])

	return (
		<main className="container">
			<div className="row justify-content-center">
				<div className="col-md-10 col-lg-8 col-xl-6">
					<div
						className="card"
						data-intro="The login credentials for this application are your Golioth JWT key and secret. You can acquire them from the Golioth Console. Make sure to select the type 'JWT Token'."
					>
						<form>
							<div className="card-header">Login</div>
							<div className="card-body">
								<div
									className="mb-3"
									data-intro="Enter your Golioth API JWT key identifier."
								>
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
										autoComplete="off"
									/>
									<div id="jwtKeyHelp" className="form-text">
										The identifier of your Golioth API JWT key.
									</div>
								</div>
								<div
									className="mb-3"
									data-intro="Enter your Golioth API JWT key secret."
								>
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
										autoComplete="off"
									/>
									<div id="jwtSecretHelp" className="form-text">
										The secret of your Golioth API JWT key.
									</div>
								</div>
							</div>
							<div className="card-footer d-flex flex-row-reverse">
								<button
									type="button"
									className="btn btn-primary"
									disabled={!isValid || loggingIn}
									onClick={() => {
										setLoggingIn(true)
									}}
									data-intro="Finally, click this button to log in."
								>
									Log in
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</main>
	)
}
