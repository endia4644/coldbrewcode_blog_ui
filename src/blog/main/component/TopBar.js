import { Affix, Tabs } from 'antd';
import React, { useState } from 'react';

export default function SideBar() {
  const tags = [
    {
      label: '전체보기',
      count: 6
    },
    {
      label: '자료구조',
      count: 3
    },
    {
      label: '알고리즘',
      count: 3
    }
  ]
  const [top, setTop] = useState(10);
  return (
    <>
      <Tabs
        style={{ paddingLeft: 20, paddingRight: 20 }}
        className='main-topbar'
        defaultActiveKey="1"
        tabPosition='top'
        items={tags.map((item, i) => {
          const id = String(i);
          return {
            label: `${item.label} (${item.count})`,
            key: `topBar_${i}`,
          };
        })}
      >
      </Tabs>
    </>
  );
}
