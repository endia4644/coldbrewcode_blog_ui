import {useLocation} from "react-router-dom";

export default function useGetWriterName() {
    const location = useLocation();
    const pathname = location.pathname;


    // @ 포함 여부 확인
    const hasNickname = pathname.includes('@');

    // 닉네임만 추출 (공백 제거 등 추가 처리 가능)
    const nickname = hasNickname ? pathname.split('@')[1] : null;

    return {nickname};
}