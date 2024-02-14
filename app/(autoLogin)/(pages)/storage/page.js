'use client'
import React, { useEffect } from "react";
import { setItemName, setFileTypeIndex, setDateCreatedIndex } from '@/store/modules/searchParametersStore';
import { useDispatch, useSelector } from 'react-redux';


export default function StoragePage(){
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(setItemName(''))
        dispatch(setFileTypeIndex(0))
        dispatch(setDateCreatedIndex(0))
    })

    return(
        <p>StoragePage</p>
    );
}