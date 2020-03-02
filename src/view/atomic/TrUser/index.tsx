import * as React from 'react'
import { User } from '../../../model'

import './index.scss'
const TrUser = (user: User) => {
    return(
        <div className={user.isError? "success-send":"failure-send"}>
            <div className="tr-user-container">
                <p>{ user.name }</p>
                <p>{ user.email }</p>
                <p>합격여부: { user.isPass }</p>
            </div>            
        </div>
    )
}

export default TrUser;