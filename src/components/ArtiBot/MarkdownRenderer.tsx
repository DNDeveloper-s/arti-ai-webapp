import ReactMarkdown from 'react-markdown';
// @ts-ignore
import remarkGfm from 'remark-gfm';

const MarkdownRenderer = ({ markdownContent }: { markdownContent: string }) => {
	const customMarkdownContent = markdownContent.replace(/\*\*(.*?)\*\*/g, '# $1');
	return (
		<div className="markdown-container">
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				components={{
					h1: ({ children }) => <h1 className="custom-h1">{children}</h1>,
					h2: ({ children }) => <h2 className="custom-h2">{children}</h2>,
					p: ({ children }) => <p className="custom-paragraph">{children}</p>,
					ul: ({ children }) => <ul style={{lineHeight: '1'}} className="list-disc pl-5 custom-ul">{children}</ul>,
					ol: ({ children }) => <ol className="list-decimal leading-[1rem] pl-5 [&>li:has(li)]:leading-[0]">{children}</ol>,
					li: ({ children }) => <li className="custom-li leading-[1.3]">{children}</li>,
					a: ({ children, href }) => (
						<a className="custom-link" href={href}>
							{children}
						</a>
					),
					pre: ({ children }) => (
						<pre className="custom-pre">
							<div className="bg-black rounded-md">
								{/*<div className="flex items-center relative text-gray-200 bg-gray-800 gizmo:dark:bg-token-surface-primary px-4 py-2 text-xs font-sans justify-between rounded-t-md">*/}
								{/*	<span>javascript</span>*/}
								{/*</div>*/}
								<div className="p-4 overflow-y-auto">
									{children}
								</div>
							</div>
						</pre>
					),
				}}
			>
				{customMarkdownContent}
			</ReactMarkdown>
		</div>
	);
};

export default MarkdownRenderer;
