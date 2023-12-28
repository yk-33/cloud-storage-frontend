'use client'
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoginStatus , setUserName} from '@/app/store/modules/loginStore';
import api from '@/api';

const {reqJwtLogin} = api


export default function AutoLoginLayout({children}){
    const dispatch = useDispatch();
    const { loginStatus } = useSelector(state => state.login);
    
    const jwtLogin = async()=>{
        let res = await reqJwtLogin()
        console.log('自动登录结果', res)
        if(res.code===200){
            dispatch(setLoginStatus(1))
            dispatch(setUserName(res.data.userName))
        }
        else{
            dispatch(setLoginStatus(-1))
        }
    }

    useEffect(()=>{
        jwtLogin()
    }, [])
    return (
        <div>
            { children }
        </div>
    )
}