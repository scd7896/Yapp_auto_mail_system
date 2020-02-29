import * as React from "react";
import { useState, useEffect } from "react";
import io from 'socket.io-client';

const CheckList = () => {
    const [userList, setUserList] = useState([]);
    const [socket, setSocekt] = useState(io.connect('http://localhost:9170'));

    useEffect(()=>{
        socket.on('list-add', (obj)=>{      
            setUserList([...userList, obj])
        })   
    },[])
    return <div></div>;
};

export default CheckList;
