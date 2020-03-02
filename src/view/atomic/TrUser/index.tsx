import * as React from "react";
import { TrUserProps } from "../../../model/propsModel";

import "./index.scss";
const TrUser = ({ user }: TrUserProps) => {
    return (
        <div className={user.isError == false ? "success-send" : "failure-send"}>
            <div className="tr-user-container">
                <p>{user.name}</p>
                <p>{user.email}</p>
                <p>{user.isPass ? "합격":"불합격"}</p>
            </div>
        </div>
    );
};

export default TrUser;
