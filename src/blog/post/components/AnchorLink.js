import React from "react";
import { Anchor } from 'antd';
const { Link } = Anchor;

export default function AnchorLink({ title, href, child }) {
  return (
    <Link href={href} title={title} key={title}>
      {child && child?.map(({ title, href, child }) => {
        return <AnchorLink title={title} href={href} key={title} child={child} />
      })}
    </Link>
  )
}