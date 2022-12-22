import React, { useEffect, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import SeriesItem from "./SeriesItem.js";

export default function Post({ posts, isUpdate }) {
  const [list, setList] = useState(null);

  useEffect(() => {
    setList(posts?.map((item) => {
      return {
        ...item
      }
    }));
  }, [posts])
  return (
    <div style={{ width: '100%' }}>
      <ol>
        {!isUpdate && list &&
          list.map((item, index) => (
            <SeriesItem post={item} index={index} key={`normal_post_${item.id}`} />

          ))
        }
        {isUpdate && list &&
          <ReactSortable
            filter=".addImageButtonContainer"
            dragClass="sortableDrag"
            list={list}
            setList={setList}
            // @ts-ignore
            animation="200"
            easing="ease-out"
            style={{ backgroundColor: '#f8f9fb', padding: 20 }}
          >
            {list.map((item, index) => (
              <SeriesItem post={item} index={index} key={`update_post_${item.id}`} />
            ))}
          </ReactSortable>
        }
      </ol>
    </div>
  );
}
