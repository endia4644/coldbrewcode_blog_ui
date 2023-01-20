
import { Affix, Anchor, Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import AnchorLink from "./AnchorLink";

export default function Navigation({ postContent }) {
  const [indexList, setIndexList] = useState(null);
  const [targetOffset, setTargetOffset] = useState(undefined);

  useEffect(() => {
    setTargetOffset(window.innerHeight / 2);
  }, []);

  function parentFind(prev, curr) {
    if (prev?.parent) {
      if (prev?.parent?.level < curr) {
        return prev?.parent;
      } else {
        return parentFind(prev?.parent, curr);
      }
    } else {
      return -1;
    }
  };

  useEffect(() => {
    const regEx = /(<h[1-5](.*?)>)(.*?)(<\/h[1-5]>)/gm;
    const regExLevel = /(?<=level)([1-5])/g;
    const regExTitle = /(?<=<h[1-5](.*?)>)(.*?)(?=<\/h[1-5]>)/g;
    const regExId = /(?<=id=")(.*?)(?=")/g;
    const array = [];
    let contents = postContent;
    const htags = contents?.match(regEx);
    let prevLevel = 0;
    let prevAnchor = null;
    htags?.map(tag => {
      const level = tag?.match(regExLevel)?.[0];
      const title = tag?.match(regExTitle)?.[0];
      const href = '#' + tag?.match(regExId);
      if (!prevLevel) {
        prevAnchor = { title, href, child: [], parent: null };
        array.push(prevAnchor);
      } else {
        /* 이전 앵커와 같은 레벨인 경우 */
        if (prevLevel === level) {
          if (prevAnchor?.parent) {
            const parent = prevAnchor?.parent;
            prevAnchor = { title, href, child: [], parent };
            parent?.child?.push(prevAnchor);
          } else {
            prevAnchor = { title, href, child: [], parent: null };
            array.push(prevAnchor);
          }
        }
        /* 이전 앵커보다 큰 레벨인 경우 */
        if (prevLevel < level) {
          const parent = prevAnchor;
          prevAnchor = { title, href, child: [], parent };
          parent.child.push(prevAnchor);
        }
        /* 이전 앵커보다 작은 레벨인 경우 */
        if (prevLevel > level) {
          const parent = parentFind(prevAnchor, level);
          console.log(parent);
          if (parent === -1) {
            prevAnchor = { title, href, child: [], parent: null };
            array.push(prevAnchor);
          } else {
            prevAnchor = { title, href, child: [], parent };
            parent.child.push(prevAnchor);
          }
        }
      }
      prevLevel = level;
    });
    setIndexList(array);
  }, [postContent]);
  return (
    <>
      <Affix className="main-navigation">
        <Row
          className="main-side"
          style={{ position: "absolute", right: "-45.5rem", top: '18rem' }}
        >
          <Col>
            <div
              className="post-content-navigation"
              style={{ width: 275, borderRadius: 12 }}
            >
              <Anchor targetOffset={targetOffset}>
                {indexList?.map((item) => {
                  return <AnchorLink title={item.title} href={item.href} key={item.title} child={item.child} />
                })}
              </Anchor>
            </div>
          </Col>
        </Row>
      </Affix>
    </>
  );
}
