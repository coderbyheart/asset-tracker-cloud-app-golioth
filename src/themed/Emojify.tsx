import React from 'react'
import styles from 'themed/Emojify.module.css'
import twemoji from 'twemoji'

export const emojify = (text: string) => (
	<span
		className={styles.emojiContainer}
		dangerouslySetInnerHTML={{
			__html: twemoji.parse(text, {
				base: `https://cdnjs.cloudflare.com/ajax/libs/twemoji/${
					import.meta.env.PUBLIC_TWEMOJI_VERSION
				}/`,
				folder: 'svg',
				ext: '.svg',
			}),
		}}
	/>
)
