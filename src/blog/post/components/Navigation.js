
import { Anchor, Col, Row } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import AnchorLink from "./AnchorLink";

export default function Navigation({ postContent }) {
  const [indexList, setIndexList] = useState(null);
  const [targetOffset, setTargetOffset] = useState(undefined);

  useEffect(() => {
    setTargetOffset(window.innerHeight / 2);
  }, []);

  /**
   * 
   * @param {*} prev 
   * @param {*} curr 
   * @returns 
   * @description 재귀적으로 부모 엘리먼트를 탐색한다.
   */
  const parentFind = useCallback(
    (prev, curr) => {
      if (prev?.parent) {
        if (prev?.parent?.level < curr) {
          return prev?.parent;
        } else {
          return parentFind(prev?.parent, curr);
        }
      } else {
        return -1;
      }
    }, []
  );

  /**
   * 
   * @param {*} element 
   * @returns 
   * @description 입력받은 element를 기점으로 부모가 없을때까지 재귀호출하며 class를 추가한다.
   */
  function parentAddClass(element) {
    const parentLevel = Number(element?.dataset?.level) - 1;
    element?.classList.add('link-visible');
    const parent = element?.closest(`.level-${parentLevel}`);
    const siblings = parent?.getElementsByClassName(`level-${element?.dataset?.level}`)

    /* 형제 태그가 있는 경우 */
    if (siblings) {
      Array.prototype.forEach.call(siblings, (element) => {
        element?.classList?.add('link-visible');
      })
    }

    if (parent) {
      parentAddClass(parent);
    } else {
      return true;
    }

  }

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
      const regSupTag = /(<sup>.*?<\/sup>)/g;                       // sup 태그 검증 정규식
      const regSpanTag = /<(\/span|span)([^>]*)>/g;                 // span 태그 검증 정규식
      const level = tag?.match(regExLevel)?.[0];
      let title = tag?.match(regExTitle)?.[0].trim();
      const href = '#' + tag?.match(regExId);

      /* 제목이 태그로 래핑되있을경우 재매핑 */
      if (regExTstTag.test(title)) {
        /* 제목이 span 태그로 매핑되어 있는 경우 제거*/
        if (regSpanTag.test(title)) {
          title = title.replace(regSpanTag, '');
        }
        /* 제목에 sup 태그가 포함되어있을 경우 재거한다 */
        if (regSupTag.test(title)) {
          let supNotArray = [];
          let supArray = title?.split(regSupTag);
          supArray.map(item => {
            if (!regSupTag.test(item)) {
              supNotArray.push(item);
            }
          })
          title = supNotArray.join('');
        } else {
          title = title?.match(regExTag)?.[0];
        }
      }

      /* 제목이 <br>이거나 공백이면 추가하지 않음 */
      if (title !== '<br>' && title !== '&nbsp;') {
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
      return 0;
    });
    setIndexList(array);
  }, [postContent, parentFind]);
  return (
    <div style={{ display: "fixed", top: '0', width: '0px', height: '0px' }}>
      <Row
        className="main-side"
      >
        <Col>
          <div
            className="post-content-navigation"
            style={{ width: 275, borderRadius: 12 }}
          >
            <Anchor
              targetOffset={targetOffset}
              style={{ maxHeight: '70vh', position: "absolute", right: "-55.5rem", top: '18rem' }}
              onChange={(item) => {
                const subLink = document.getElementsByClassName('sub-link');
                if (subLink) {
                  Array.prototype.forEach.call(subLink, (element) => {
                    element?.classList?.remove('link-visible');
                  })
                }
                const current = document.getElementById(item);
                current?.classList.add('link-visible');
                const nextLevel = Number(current?.dataset?.level) + 1;
                const prevLevel = Number(current?.dataset?.level) - 1;
                const parent = current?.closest(`.level-${prevLevel}`);
                const siblings = parent?.getElementsByClassName(`level-${current?.dataset?.level}`)
                const child = current?.getElementsByClassName(`level-${nextLevel}`);

                /* 형제 태그가 있는 경우 */
                if (siblings) {
                  Array.prototype.forEach.call(siblings, (element) => {
                    element?.classList?.add('link-visible');
                  })
                }

                /* 부모 태그가 있는 경우 */
                if (parent) {
                  parentAddClass(parent);
                }

                if (child) {
                  Array.prototype.forEach.call(child, (element) => {
                    element.classList.add('link-visible');
                  })
                }
              }}
            >
              {indexList?.map((item) => {
                return <AnchorLink data={item} key={item.href} />
              })}
            </Anchor>
          </div>
        </Col>
      </Row>
    </div>
  );
}
