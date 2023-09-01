import React, {DetailedHTMLProps, JSX, LiHTMLAttributes, ReactElement} from 'react';

type Tag = '```' | '``' | '1.' | '*' | '**'

enum Tags {
	p = '\n',
	code = '```',
	pre = '``',
	ul = '*',
	ol = '1.',
	strong = '**',
}

//

const parts = [
	{
		node: React.createElement('p'),
		cursor: {
			start: 0,
			end: 76
		},
		children: [
			{
				node: React.createElement('strong'),
				cursor: {
					start: 20,
					end: 34
				}
			}
		]
	}
]

export class OutputParser {

	getPNode(text: string) {
		return <p>{text}</p>
	}

	getLiNode(text: string) {
		return <li>{text}</li>
	}

	getUlNode(liNodes: ReactElement[]) {
		return <ul>{liNodes.map(c => c)}</ul>
	}

	getOlNode(liNodes: ReactElement[]) {
		return <ul>{liNodes.map(c => c)}</ul>
	}

	getStrongNode(text: string) {
		return <strong>{text}</strong>
	}

	parse(text = "This is a dummy text line and we want to check\n Hey can we do something about it.") {
		const cursorPosition = 0;
		const tagHolder = new TagHolder();

		for(let i = cursorPosition; i < text.length; i++) {
			const char = text[i];
			// handle non-void tags
			// handle void tags
			if(tagHolder.isEmpty()) {
				tagHolder.push(Tags.p);
			}
		}
	}
}

class TagHolder {
	tags: Tag[] = [];
	push(tag: Tag) {
		this.tags.push(tag);
	}

	pop(tag: Tag) {
		this.tags.pop();
	}

	isEmpty(): boolean {
		return this.tags.length === 0;
	}
}
