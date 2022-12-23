import { Empty, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import SeriesItem from "./SeriesItem.js";

export default function Post({ posts, isUpdate, getList }) {
  const [list, setList] = useState(null);
  useEffect(() => {
    setList(posts?.map((item) => {
      return {
        ...item
      }
    }));
  }, [posts, isUpdate])

  const onRemove = id => {
    // user.id 가 파라미터로 일치하지 않는 원소만 추출해서 새로운 배열을 만듬
    // = user.id 가 id 인 것을 제거함
    setList(list.filter(item => item.id !== id));
    getList(list.filter(item => item.id !== id));
  };

  return (
    <div style={{ width: '100%' }}>
      <ol>
        {list?.length === 0 &&
          <Empty
            style={{ marginTop: 60 }}
            description={
              <Typography.Title level={4}>시리즈에 게시글을 추가해주세요!</Typography.Title>
            }
          />
        }
        {!isUpdate && list &&
          list.map((item) => (
            <SeriesItem post={item} key={`normal_post_${item.id}`} isUpdate={false} />
          ))
        }
        {isUpdate && list?.length !== 0 &&
          <ReactSortable
            filter=".addImageButtonContainer"
            dragClass="sortableDrag"
            list={list}
            setList={
              (newState) => {
                setList(newState);
                getList(newState);
              }
            }
            // @ts-ignore
            animation="200"
            easing="ease-out"
            style={{ backgroundColor: '#f8f9fb', padding: 20 }}
          >
            {list.map((item, index) => (
              <SeriesItem post={item} key={`update_post_${item.id}`} isUpdate={true} onRemove={onRemove} />
            ))}
          </ReactSortable>
        }
      </ol>
    </div>
  );
}
