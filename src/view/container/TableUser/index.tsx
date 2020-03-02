import * as React from "react";
import { TableUserProps } from "../../../model/propsModel";
import TrUser from "../../atomic/TrUser";
import './index.scss'
const TableUser = ({ users, isError }: TableUserProps) => {
    return (
        <div className="table-user-container">
            <p className="table-user-title">
                {!isError? "전송 성공" : "전송 실패"}
            </p>
            <div className="table-user-box">
                <div className="table-user-head-container">
                    <p>이름</p>
                    <p>이메일</p>
                    <p>합격 여부</p>
                </div>
                {users.map((el,i) => {
                    return <TrUser user={el} key={i}/>;
                })}
            </div>
        </div>
    );
};

export default TableUser;
