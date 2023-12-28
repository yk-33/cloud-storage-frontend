import React, { useEffect } from "react";

export default function Test(){

    useEffect(()=>{
        console.log('重新加载')
    },[])
    return (
        <></>
    )
}