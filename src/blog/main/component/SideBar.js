import { Affix, Col, Divider, Row, Tabs } from 'antd';
import Search from 'antd/lib/input/Search';
import React from 'react';

export default function SideBar({ hashtag }) {
    const [activeKey, setActiveKey] = React.useState(null)
    return (
        <>
            <Affix className='main-sidebar'>
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
                                items={hashtag.map((item, i) => {
                                    return {
                                        label: `${item.hashtagName} (${item.postCount})`,
                                        key: item.id,
                                        onTabClick: (item) => {
                                            console.log(activeKey)
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
