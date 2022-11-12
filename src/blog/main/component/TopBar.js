import { Tabs } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../state';

export default function Topbar({ hashtag }) {
  const dispatch = useDispatch();
  const sideActiveKey = useSelector(state => state.main.sideActiveKey);
  const onchangFunction = (sideActiveKey) => {
    dispatch(actions.fetchHashtagPost(null, 0, sideActiveKey !== 0 ? sideActiveKey : ''))
  }
  /* 사이드탭 제어함수 */
  const onTabClick = (target) => {
    dispatch(actions.setValue('sideActiveKey', target));
  }
  return (
    <>
      <Tabs
        style={{ paddingLeft: 20, paddingRight: 20 }}
        className='main-topbar'
        defaultActiveKey='0'
        activeKey={sideActiveKey}
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
