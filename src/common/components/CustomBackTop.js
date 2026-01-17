import {BackTop} from "antd";
import {UpArrowIcon} from "./Icon";
import React from "react";

export default function CustomBackTop() {
    return (
        <BackTop>
            <div>
                <UpArrowIcon />
            </div>
        </BackTop>
    )
}