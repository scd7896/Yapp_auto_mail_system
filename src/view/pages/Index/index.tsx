import * as React from "react";
import { useState, useEffect } from "react";
import * as io from "socket.io-client";
import * as axios from "axios";
import TableUser from "../../container/TableUser";
import { url } from '../../../_data';
import { User } from '../../../model/index'

import "./index.scss";



const App = () => {
    const [userList, setUserList] = useState([]);
    const [oneUser, setOneUser] = useState({});
    const [allUserCount, setAllUserCount] = useState(0);
    const [socket, setSocket] = useState(null);
    const startSendMails = async() => {
        setSocket(io(url));
    };
    const reSendMails = () => {
        const targetResendUsers: Array<User> = userList.filter((el: User)=>{ return el.isError === true });
        console.log(userList);
        axios.default.post(`${url}/resendmail`, {
            list: targetResendUsers
        })
    }
    const addUserList = (obj: User) =>{
        setOneUser(obj)
    }
    useEffect(() => {
        if(socket !== null){
            socket.on("list-add", (obj: User) => {
                addUserList(obj);
            });
            axios.default.get(`${url}/sendmail`)
                .then((value)=>{
                    setAllUserCount(value.data);
                })
        }
    }, [socket]);

    useEffect(()=>{
        if(oneUser){
            setUserList([...userList, oneUser])
            console.log(userList);
        }
    },[oneUser])
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
            <div className="result-container">
                <TableUser users={userList.filter((el)=> el.isError==false)} isError={false} />
                <TableUser users={userList.filter((el)=> el.isError==true)} isError={true} />
            </div>
        </div>
    );
};

export default App;
