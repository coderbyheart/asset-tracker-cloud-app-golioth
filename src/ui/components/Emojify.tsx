import React from 'react'
import twemoji from 'twemoji'
import 'ui/components/Emojify.css'

export const emojify = (text: string) => (
	<span
		className="emojiContainer"
		dangerouslySetInnerHTML={{
			__html: twemoji.parse(text, {
				base: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/13.1.0/',
				folder: 'svg',
				ext: '.svg',
			}),
		}}
	/>
)
