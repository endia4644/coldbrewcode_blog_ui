import React, { useEffect, useRef } from "react";
import { Anchor } from 'antd';
import { useDispatch } from "react-redux";
import { actions } from "../state";
const { Link } = Anchor;

export default function AnchorLink({ data }) {
  const dispatch = useDispatch();
  const link = useRef(null);
  useEffect(() => {
    if (data) {
      const parent = data?.parent?.href;
      const child = [];
      data?.child.map(item => {
        child.push(item?.href);
      })
      dispatch(actions.setValue(data?.href, { parent, child }));
    }
    // 첫번째 목차 활성화
    if (data?.href == '#tag-0') {
      link.current.handleClick()
    }
  }, [])
  return (
    <div id={data?.href} className={data?.level > 1 ? `link sub-link level-${data?.level}` : 'link main-link level-1'} data-level={data?.level}>
      <Link href={data?.href} title={data?.title} key={data?.href} data-level={data?.level} ref={link}>
        {data.child && data.child?.map((data) => {
          return <AnchorLink data={data} key={data.href} />
        })}
      </Link>
    </div>
  )
}