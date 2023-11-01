// import ReactMarkdown from 'react-markdown';
// @ts-ignore
// import remarkGfm from 'remark-gfm';
// import Remarkable from 'remarkable';
// import RemarkableReactRenderer from 'remarkable-react';
import Markdown from 'react-remarkable';

const MarkdownRenderer = ({ markdownContent }: { markdownContent: string }) => {
	// const customMarkdownContent = markdownContent.replace(/\*\*(.*?)\*\*/g, '# $1');

	// const remarkable = new Remarkable();
	//
	// // Parse the Markdown and render it as HTML
	// const html = remarkable.render(markdownContent);
	//
	// return <div dangerouslySetInnerHTML={{ __html: html }} />;

	return <div className="chat-markdown">
		<Markdown source={markdownContent} />
	</div>

	return <div className="chat-markdown">
		<Markdown source={`
		# Remarkable

> Experience real-time editing with Remarkable!

Click the \`clear\` link to start with a clean slate, or get the \`permalink\` to share or save your results.

***

# h1 Heading
## h2 Heading
### h3 Heading
#### h4 Heading
##### h5 Heading
###### h6 Heading


## Horizontal Rules

___

***

***


## Typographic replacements

Enable typographer option to see result.

(c) (C) (r) (R) (tm) (TM) (p) (P) +-

test.. test... test..... test?..... test!....

!!!!!! ???? ,,

Remarkable -- awesome

"Smartypants, double quotes"

'Smartypants, single quotes'


## Emphasis

**This is bold text**

__This is bold text__

*This is italic text*

_This is italic text_

~~Deleted text~~

Superscript: 19^th^

Subscript: H~2~O

++Inserted text++

==Marked text==


## Blockquotes

> Blockquotes can also be nested...
>> ...by using additional greater-than signs right next to each other...
> > > ...or with spaces between arrows.


## Lists

Unordered

+ Create a list by starting a line with \`+\`, \`-\`, or \`*\`
+ Sub-lists are made by indenting 2 spaces:
  - Marker character change forces new list start:
    * Ac tristique libero volutpat at
    + Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
+ Very easy!

Ordered

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa


1. You can use sequential numbers...
1. ...or keep all the numbers as \`1.\`

Start numbering with offset:

57. foo
1. bar


## Code

Inline \`code\`

Indented code

    // Some comments
    line 1 of code
    line 2 of code
    line 3 of code


Block code "fences"

\`\`\`
Sample text here...
\`\`\`

Syntax highlighting

\`\`\` js
var foo = function (bar) {
  return bar++;
};

console.log(foo(5));
\`\`\`

## Tables

| Option | Description |
| ------ | ----------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |

Right aligned columns

| Option | Description |
| ------:| -----------:|
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |


## Links

[link text](http://dev.nodeca.com)

[link with title](http://nodeca.github.io/pica/demo/ "title text!")

Autoconverted link https://github.com/nodeca/pica (enable linkify to see)


## Images

![Minion](https://octodex.github.com/images/minion.png)
![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg "The Stormtroopocat")

Like links, Images also have a footnote style syntax

![Alt text][id]

With a reference later in the document defining the URL location:

[id]: https://octodex.github.com/images/dojocat.jpg  "The Dojocat"


## Footnotes

Footnote 1 link[^first].

Footnote 2 link[^second].

Inline footnote^[Text of inline footnote] definition.

Duplicated footnote reference[^second].

[^first]: Footnote **can have markup**

    and multiple paragraphs.

[^second]: Footnote text.


## Definition lists

Term 1

:   Definition 1
with lazy continuation.

Term 2 with *inline markup*

:   Definition 2

        { some code, part of Definition 2 }

    Third paragraph of definition 2.

_Compact style:_

Term 1
  ~ Definition 1

Term 2
  ~ Definition 2a
  ~ Definition 2b


## Abbreviations

This is HTML abbreviation example.

It converts "HTML", but keep intact partial entries like "xxxHTMLyyy" and so on.

*[HTML]: Hyper Text Markup Language


***

__Advertisement :)__

- __[pica](https://nodeca.github.io/pica/demo/)__ - high quality and fast image
  resize in browser.
- __[babelfish](https://github.com/nodeca/babelfish/)__ - developer friendly
  i18n with plurals support and easy syntax.

You'll like those projects! :)

		`} />
	</div>

	// return (
	// 	<div className="markdown-container">
	// 		<ReactMarkdown
	// 			remarkPlugins={[remarkGfm]}
	// 			components={{
	// 				h1: ({ children }) => <h1 className="custom-h1">{children}</h1>,
	// 				h2: ({ children }) => <h2 className="custom-h2">{children}</h2>,
	// 				p: ({ children }) => <p className="custom-paragraph">{children}</p>,
	// 				ul: ({ children }) => <ul style={{lineHeight: '1'}} className="list-disc pl-5 custom-ul">{children}</ul>,
	// 				ol: ({ children }) => <ol className="list-decimal leading-[1rem] pl-5 [&>li:has(li)]:leading-[0]">{children}</ol>,
	// 				li: ({ children }) => <li className="custom-li leading-[1.3]">{children}</li>,
	// 				a: ({ children, href }) => (
	// 					<a className="custom-link" href={href}>
	// 						{children}
	// 					</a>
	// 				),
	// 				pre: ({ children }) => (
	// 					<pre className="custom-pre">
	// 						<div className="bg-black rounded-md">
	// 							{/*<div className="flex items-center relative text-gray-200 bg-gray-800 gizmo:dark:bg-token-surface-primary px-4 py-2 text-xs font-sans justify-between rounded-t-md">*/}
	// 							{/*	<span>javascript</span>*/}
	// 							{/*</div>*/}
	// 							<div className="p-4 overflow-y-auto">
	// 								{children}
	// 							</div>
	// 						</div>
	// 					</pre>
	// 				),
	// 			}}
	// 		>
	// 			{customMarkdownContent}
	// 		</ReactMarkdown>
	// 	</div>
	// );
};

export default MarkdownRenderer;
