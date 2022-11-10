import { FieldTimeOutlined, HeartOutlined, LockOutlined, MessageOutlined } from "@ant-design/icons";
import { Button, Col, List, Space, Typography } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

export default function Series() {
  const series = useSelector(state => state.main.series);
  return (
    <>
      <List
        className="main-list"
        grid={{
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }
        }
        itemLayout="vertical"
        size="large"
        dataSource={series}
        renderItem={(item) => (
          <List.Item
            className="main-list-item"
            style={{ paddingTop: 30 }}
            key={item.key}
            actions={[
              <IconText icon={FieldTimeOutlined} text="약 2시간 전" key="list-vertical-star-o" />,
              <IconText icon={HeartOutlined} text="156" key="list-vertical-like-o" />,
              <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
              item.lockYsno === 'Y' && <IconText icon={LockOutlined} text="비공개" key="list-vertical-message" />
            ]}
          >
            <img
              style={{ paddingBottom: 20 }}
              width={'100%'}
              alt="logo"
              src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
            />
            <Typography.Title>
              <Link to={`/${item.postNo}`}>{item.title}</Link>
            </Typography.Title>
            <List.Item.Meta
              description={item.description}
            />
            {item.content}
            <Col>
              {item.tags.map((item, i) => (
                <Button key={`button_${i}`} className="tag-button" type="primary" shape="round" style={{ marginTop: 10, marginRight: 10 }}>{item}</Button>
              ))}
            </Col>
          </List.Item>
        )}
      />
    </>
  )
}