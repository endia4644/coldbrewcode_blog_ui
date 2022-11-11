import { Tabs } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import { actions } from '../state';

export default function Topbar({ hashtag }) {
  const dispatch = useDispatch();
  const onchangFunction = (activeKey) => {
    console.log(activeKey);
    dispatch(actions.fetchAllPost(null, 0, activeKey))
  }
  return (
    <>
      <Tabs
        style={{ paddingLeft: 20, paddingRight: 20 }}
        className='main-topbar'
        defaultActiveKey="1"
        tabPosition='top'
        onChange={onchangFunction}
        items={hashtag.map((item, i) => {
          return {
            label: `${item.hashtagName} (${item.postCount})`,
            key: item.id,
          };
        })}
      >
      </Tabs>
    </>
  );
}
