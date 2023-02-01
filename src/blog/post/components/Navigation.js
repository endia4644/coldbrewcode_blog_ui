
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
    const regExHTag = /(<h[1-5](.*?)>)(.*?)(<\/h[1-5]>)/gm;       // htag 매칭 정규식
    const array = [];                                             // 태그정보 최상위 배열
    let contents = postContent;
    const htags = contents?.match(regExHTag);
    let prevLevel = 0;
    let prevAnchor = null;
    /* 
      h1 ~ h5 태그를 컨텐츠에서 매칭해해서 계층화해서 랜더링한다.
      <br>이나 <span> 태그는 제거하는 정제작업을 부가적으로 수행한다.
    */
    htags?.map(tag => {
      const regExLevel = /(?<=level)([1-5])/g;                      // class 매칭 정규식
      const regExTitle = /(?<=<h[1-5](.*?)>)(.*?)(?=<\/h[1-5]>)/g;  // title 매칭 정규식
      const regExId = /(?<=id=")(.*?)(?=")/g;                       // id 매칭 정규식
      const regExTag = /(?<=<(.*?)>)(.*?)(?=<\/.*>)/g;              // 태그 매칭 정규식
      const regExTstTag = /(<(.*?)>)(.*?)(<\/.*>)/gm;               // 태그 검증 정규식

      const level = tag?.match(regExLevel)?.[0];
      let title = tag?.match(regExTitle)?.[0].trim();
      const href = '#' + tag?.match(regExId);

      /* 제목이 태그로 래핑되있을경우 재매핑 */
      if (regExTstTag.test(title)) {
        title = title?.match(regExTag)?.[0];
      }

      /* 제목이 <br>이면 추가하지 않음 */
      if (title != '<br>' && title != '&nbsp;') {
        if (!prevLevel) {
          prevAnchor = { title, href, level, child: [], parent: null };
          array.push(prevAnchor);
        } else {
          /* 이전 앵커와 같은 레벨인 경우 */
          if (prevLevel === level) {
            if (prevAnchor?.parent) {
              const parent = prevAnchor?.parent;
              prevAnchor = { title, href, level, child: [], parent };
              parent?.child?.push(prevAnchor);
            } else {
              prevAnchor = { title, href, level, child: [], parent: null };
              array.push(prevAnchor);
            }
          }
          /* 이전 앵커보다 큰 레벨인 경우 */
          if (prevLevel < level) {
            const parent = prevAnchor;
            prevAnchor = { title, href, level, child: [], parent };
            parent.child.push(prevAnchor);
          }
          /* 이전 앵커보다 작은 레벨인 경우 */
          if (prevLevel > level) {
            const parent = parentFind(prevAnchor, level);
            if (parent === -1) {
              prevAnchor = { title, href, level, child: [], parent: null };
              array.push(prevAnchor);
            } else {
              prevAnchor = { title, href, level, child: [], parent };
              parent.child.push(prevAnchor);
            }
          }
        }
        prevLevel = level;
      }
    });
    console.log(array);
    setIndexList(array);
  }, [postContent]);
  return (
    <>
      <Affix className="main-navigation">
        <Row
          className="main-side"
          style={{ position: "absolute", right: "-55.5rem", top: '18rem' }}
        >
          <Col>
            <div
              className="post-content-navigation"
              style={{ width: 275, borderRadius: 12 }}
            >
              <Anchor targetOffset={targetOffset} style={{ maxHeight: '70vh' }}>
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
