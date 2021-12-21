import React from 'react'
import twemoji from 'twemoji'
import styles from 'ui/components/Emojify.module.css'

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
