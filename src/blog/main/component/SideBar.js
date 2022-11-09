import { Affix, Anchor, Col, Divider, Row, Tabs, Typography } from 'antd';
import Search from 'antd/lib/input/Search';
import React, { useState } from 'react';

export default function SideBar() {
    const [top, setTop] = useState(10);
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
    return (
        <>
            <Affix className='main-sidebar' offsetTop={top}>
                <Row className='main-side' style={{ position: 'absolute', left: '-38.5rem', top: '14rem' }}>
                    <Col>
                        <Search
                            placeholder="검색어를 입력하세요"
                            onSearch={() => { }}
                            style={{
                                width: 200,
                            }}
                        />
                        <Divider />
                        <Col style={{ marginTop: 20 }}>
                            <Tabs
                                tabPosition='left'
                                items={tags.map((item, i) => {
                                    const id = String(i + 1);
                                    return {
                                        label: `${item.label}(${item.count})`,
                                        key: `sideBar_${i}`,
                                        onTabClick: (item) => {
                                            console.log(item);
                                        }
                                    };
                                })}
                            />
                        </Col>
                    </Col>
                </Row>
            </Affix>
        </>
    );
}
