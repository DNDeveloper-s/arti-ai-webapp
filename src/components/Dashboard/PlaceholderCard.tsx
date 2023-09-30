export default function PlaceholderCard({className}: {className?: string}) {
	return (
		<div className={'flex-shrink-0 relative border-2 border-secondaryBackground transition-all cursor-pointer rounded-xl overflow-hidden text-[9px] bg-secondaryBackground ' + (className ?? '')} />
	)
}
