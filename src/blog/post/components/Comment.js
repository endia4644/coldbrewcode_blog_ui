import React, { useState } from "react";
import { Avatar, Comment } from "antd";

export default function Comments({ id = null }) {
  const [expend, setExpend] = useState(false);
  return (
    <Comment
      actions={[
        <span
          key="comment-nested-reply-to"
          onClick={() => {
            setExpend(!expend);
          }}
        >
          답글 달기
        </span>,
      ]}
      author={"Han Solo"}
      avatar={
        <Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />
      }
      content={
        <p>
          We supply a series of design principles, practical patterns and high
          quality design resources (Sketch and Axure).
        </p>
      }
      datetime={<span>8 hours ago</span>}
    >
      {expend && (
        <>
          <Comment
            actions={[
              <span
                key="comment-nested-reply-to"
                onClick={() => {
                  setExpend(!expend);
                }}
              >
                답글 달기
              </span>,
            ]}
            author={"Han Solo"}
            avatar={
              <Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />
            }
            content={
              <p>
                We supply a series of design principles, practical patterns and
                high quality design resources (Sketch and Axure).
              </p>
            }
            datetime={<span>8 hours ago</span>}
          ></Comment>
          <Comment
            actions={[
              <span
                key="comment-nested-reply-to"
                onClick={() => {
                  setExpend(!expend);
                }}
              >
                답글 달기
              </span>,
            ]}
            author={"Han Solo"}
            avatar={
              <Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />
            }
            content={
              <p>
                We supply a series of design principles, practical patterns and
                high quality design resources (Sketch and Axure).
              </p>
            }
            datetime={<span>8 hours ago</span>}
          ></Comment>
        </>
      )}
      {id}
    </Comment>
  );
}
