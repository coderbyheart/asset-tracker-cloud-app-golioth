import introJs from 'intro.js'
import React from 'react'
import { emojify } from 'theme/Emojify'
import { withLocalStorage } from 'utils/withLocalStorage'

const intro = introJs()

const storedHidden = withLocalStorage<boolean>({
	key: 'settings:helpNoteHidden',
	defaultValue: false,
})

export const HelpNote = () => {
	if (storedHidden.get()) return null
	return (
		<div
			className="alert alert-info alert-dismissible fade show mt-4"
			role="alert"
		>
			Click
			<button
				type="button"
				className="btn btn-link"
				onClick={() => {
					window.requestAnimationFrame(() => {
						intro.start()
					})
				}}
			>
				{emojify('💁')} Help
			</button>
			to view a detailed description of the settings.
			<button
				type="button"
				className="btn-close"
				data-bs-dismiss="alert"
				aria-label="Close"
				onClick={() => {
					storedHidden.set(true)
				}}
			></button>
		</div>
	)
}
