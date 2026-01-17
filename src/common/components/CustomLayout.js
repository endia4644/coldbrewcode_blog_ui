import CustomHeader from "./CustomHeader";
import {Content} from "antd/lib/layout/layout";
import CustomBackTop from "./CustomBackTop";
import React from "react";
import {Outlet} from "react-router-dom";

export default function CustomLayout({classNames}) {
    return (
        <>
            <CustomHeader classNames={'main-header dashboard-header'}/>
            <Content className={classNames}>
                <Outlet />
            </Content>
            <CustomBackTop />
        </>
    )
}