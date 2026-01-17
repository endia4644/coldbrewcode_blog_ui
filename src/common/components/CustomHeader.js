import {actions as authActions} from "../../blog/auth/state";
import {Col, Row} from "antd";
import {useDispatch} from "react-redux";
import {Header} from "antd/lib/layout/layout";
import Settings from "./Settings";

export default function CustomHeader({classNames}) {
    const dispatch = useDispatch();
    function logout() {
        dispatch(authActions.fetchLogout());
    }

    return (
        <Header className={`site-layout-background fix-menu ${classNames}`}>
            <Row justify="end">
                <Col>
                    <Settings logout={logout} />
                </Col>
            </Row>
        </Header>
    );
}