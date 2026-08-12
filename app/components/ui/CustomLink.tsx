import Link from "next/link";

export default function CustomLink(props : any){
    const href = typeof props?.href === 'string' ? props.href : '';
    const isInternalLink = href.startsWith('/');

    if (isInternalLink) {
        return (
            <Link href={href}>
                {props.children}
            </Link>
        );
    }

    return <a target="_blank" rel="noopener noreferrer" {...props} />;
};