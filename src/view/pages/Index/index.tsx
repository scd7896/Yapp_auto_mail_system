import * as React from "react";
import { useState, useEffect } from "react";
import * as io from "socket.io-client";
import * as axios from "axios";
import { url } from '../../../_data';
import { User } from '../../../model/index'

import "./index.scss";



const App = () => {
    const [userList, setUserList] = useState([]);
    const [allUserCount, setAllUserCount] = useState(0);
    let tempUserList: Array<User> = [];
    const [socket, setSocket] = useState(null);
    const startSendMails = () => {
        setSocket(io(url));
        axios.default.get(`${url}/sendmail`)
            .then((value)=>{
                setAllUserCount(value.data);
            })
    };
    const reSendMails = () => {
        const targetResendUsers: Array<User> = userList.filter((el: User)=>{ return el.isError === true });
        axios.default.post(`${url}/resendmail`, {
            list: targetResendUsers
        })
    }
    useEffect(() => {
        if (socket !== null) {
            socket.on("list-add", (obj: User) => {
                if(obj !== null){
                    tempUserList.push(obj);
                    setUserList(tempUserList)
                }
            });
        }
    }, [socket]);
    return (
        <div>
            <div>
                <div className="">
                    <button 
                        onClick={startSendMails}
                        disabled={socket !== null}>
                            소켓 열고 시작하기
                    </button>
                    <button
                        onClick={reSendMails}
                        disabled={allUserCount===userList.length}>
                            재전송
                    </button>
                </div>
            </div>
            <div className="result-container">이곳에 결과물이 온다 이말이야</div>
        </div>
    );
};

export default App;
