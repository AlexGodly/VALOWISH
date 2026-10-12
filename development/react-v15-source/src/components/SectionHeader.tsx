import type{ReactNode}from'react';
export function SectionHeader({code,title,lead,actions}:{code:string;title:string;lead?:string;actions?:ReactNode}){return <header className="section-header"><div><p className="eyebrow">// {code}</p><h1>{title}</h1>{lead&&<p className="lead">{lead}</p>}</div>{actions&&<div className="section-actions">{actions}</div>}</header>}
