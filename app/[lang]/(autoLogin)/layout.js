'use client'
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoginStatus, setUserName } from '@/store/modules/loginStore';
import api from '@/api';

const { reqJwtLogin } = api


export default function AutoLoginLayout({ children }) {
    const dispatch = useDispatch();

    const jwtLogin = async () => {
        console.log('登录')
        let res = await reqJwtLogin()
        // console.log('自动登录结果', res)
        if (res.code === 200) {
            if (res.data.isSuperAdmin) {
                dispatch(setLoginStatus(2))
            }
            else {
                dispatch(setLoginStatus(1))
            }
            dispatch(setUserName(res.data.username))
        }
        else {
            dispatch(setLoginStatus(-1))
        }
    }

    useEffect(() => {
        jwtLogin()
    }, [])
    return (
        <div>
            {children}
        </div>
    )
}