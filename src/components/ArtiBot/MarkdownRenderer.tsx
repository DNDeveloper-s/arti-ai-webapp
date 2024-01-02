// import ReactMarkdown from 'react-markdown';
// @ts-ignore
// import remarkGfm from 'remark-gfm';
// import Remarkable from 'remarkable';
// import RemarkableReactRenderer from 'remarkable-react';
import Markdown from 'react-remarkable';
import React, {useEffect} from 'react';

const MarkdownRenderer = ({ markdownContent }: { markdownContent: string }) => {
	// const customMarkdownContent = markdownContent.replace(/\*\*(.*?)\*\*/g, '# $1');

	// const remarkable = new Remarkable();
	//
	// // Parse the Markdown and render it as HTML
	// const html = remarkable.render(markdownContent);
	//
	// return <div dangerouslySetInnerHTML={{ __html: html }} />;

	return <div className="chat-markdown">
		<Markdown options={{
			html: true,
		}} source={markdownContent} />
	</div>

	// return <div className="chat-markdown">
	// 	<Markdown source={
	// 		<div className="">
	// 			<div>
	// 				<p className="text-white text-opacity-50 font-diatype text-[1em] leading-[1.6em] my-[0.4em]">Congratulations! We have successfully generated the ad for you. To explore different ad variants and make the best choice, simply navigate to the right pane and switch between tabs.</p>
	// 			</div>
	// 			<div className={"mt-[0.67em]"}>
	// 				<span className="font-semibold text-primary text-[1.2em]">Ad Summary</span>
	// 				<p className="text-white text-opacity-80 font-diatype text-[1em] leading-[1.6em] my-[0.55em]">{json.summary}</p>
	// 			</div>
	// 			<div className={"border-t border-gray-600 pt-3 mt-5"}>
	// 				<ul className="list-disc px-4">
	// 					<li className="text-white text-opacity-50 font-diatype text-[1em] leading-[1.6em] my-2">If you find the current advertisement unsatisfactory, please feel free to share additional information with us. This will enable us to create a better ad for you, and you can easily generate a new one by clicking the 'Regenerate Ad' button.</li>
	// 					<li className="text-white text-opacity-50 font-diatype text-[1em] leading-[1.6em] my-2">Feel free to provide feedback on each ad variant by visiting the "Provide Feedback" section on the right-hand side of the tab.</li>
	// 				</ul>
	// 			</div>
	// 			{/*{json.Ads.map(adVariant => (*/}
	// 			{/*	<AdVariant key={adVariant['One liner']} adVariant={adVariant} style={{fontSize: variantFontSize ?? '14px'}} />*/}
	// 			{/*))}*/}
	// 		</div>
	//
	// 	} />
	// </div>

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
