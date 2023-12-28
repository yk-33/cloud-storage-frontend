'use client'
import React, { useState } from 'react';
import { useRef } from 'react';
import { Button, Flex } from 'antd';
import TextField from '@mui/material/TextField';
import { _fetch } from '../utils/request';
import Test from './test';
import api from '../api';
let { reqGetPath, reqRegisterUser, reqDeleteUser, reqGetAllUsers, reqJwtLogin, reqLogin,
  reqGetFolderStructure, reqNewFolder, reqPermanentDeleteFolder, reqMoveFolder, reqDeleteFolder, reqUndoFolder,
  reqPermanentDeleteFile, reqMoveFile, reqDeleteFile, reqUndoFile} = api
const BACK_END_URL = 'http://localhost:8080'

export default function Home() {
  const[testKey, setTestKey] = useState(0)

  const inputRef = useRef(null);

  const regitsterUser = async (e) => {
    let data = await reqRegisterUser('王五', '1234')
    console.log(data)
  }
  const deleteUser = async (e) => {
    let data = await reqDeleteUser('2ed68f8b75cc4f0f9f84082093b154b9')
    console.log(data)
  }
  const getAllUsers = async () => {
    let data = await reqGetAllUsers()
    console.log(data)
  }
  const login = async () => {
    let data = await reqLogin('张三', '1234')
    console.log(data)
  }
  const jwtLogin = async () => {
    let data = await reqJwtLogin()
    console.log(data)
  }
  //文件夹
  const getFolderStructure = async () => {
    let data = await reqGetFolderStructure()
    console.log(data)
  }
  const newFolder = async (folderName, fatherFolderId) => {
    let data = await reqNewFolder(folderName, fatherFolderId)
    console.log(data)
  }
  const permanentDeleteFolder = async (folderId) => {
    let data = await reqPermanentDeleteFolder(folderId)
    console.log(data)
  }
  const moveFolder = async (folderId, newFatherFolderId) => {
    let data = await reqMoveFolder(folderId, newFatherFolderId)
    console.log(data)
  }
  const deleteFolder = async (folderId) => {
    let data = await reqDeleteFolder(folderId)
    console.log(data)
  }
  const undoFolder = async (folderId) => {
    let data = await reqUndoFolder(folderId)
    console.log(data)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submit")
    console.log(inputRef.current.files[0])
    const formData = new FormData();
    formData.append('file', inputRef.current.files[0]);
    console.log(formData.get('file'))
    fetch(BACK_END_URL + `/files?folder-id=${13}`, {
      method: 'POST',
      headers: { 
        // 'Content-Type': 'multipart/form-data',
      },
      body: formData,
      credentials: 'include'
    })
    .then(response => {
      console.log(response)
    })
    .catch (error => { });
  }
  
  const permanentDeleteFile = async (fileId) => {
    let data = await reqPermanentDeleteFile(fileId)
    console.log(data)
  }
  const moveFile = async (fileId, newFatherFolderId) => {
    let data = await reqMoveFile(fileId, newFatherFolderId)
    console.log(data)
  }
  const deleteFile = async (fileId) => {
    let data = await reqDeleteFile(fileId)
    console.log(data)
  }
  const undoFile = async (fileId) => {
    let data = await reqUndoFile(fileId)
    console.log(data)
  }
  
  const newDownLoad = async (fileId) =>{
    window.open(BACK_END_URL + `/files/${fileId}`)
  }

return (

  <main >
    <div >
      <p>hello</p>
      <Button type="primary" onClick={regitsterUser}>注册</Button>
      <Button type="primary" onClick={deleteUser}>删除</Button>
      <Button type="primary" onClick={getAllUsers}>显示</Button>
      <Button type="primary" onClick={login}>登录</Button>
      <Button type="primary" onClick={jwtLogin}>jwt登录</Button>
      <Button type="primary" onClick={getAllUsers}>登出</Button>
      <p>文件夹操作</p>
      <Button type="primary" onClick={getFolderStructure}>显示文件结构</Button>
      <Button type="primary" onClick={() => newFolder('文件夹1', 13)}>创建文件夹</Button>
      <Button type="primary" onClick={() => permanentDeleteFolder(20)}>永久删除文件夹</Button>
      <Button type="primary" onClick={() => moveFolder(5, 1)}>移动文件夹</Button>
      <Button type="primary" onClick={() => deleteFolder(20)}>删除文件夹</Button>
      <Button type="primary" onClick={() => undoFolder(16)}>恢复文件夹</Button>
      <p>文件</p>
      <form onSubmit={handleSubmit}>
        <label>
          Upload file:
          <input type="file" ref={inputRef} />
        </label>
        <button type="submit">Submit</button>
      </form>
      <Button type="primary" onClick={() => permanentDeleteFile(5)}>永久删除文件</Button>
      <Button type="primary" onClick={() => moveFile(5, 1)}>移动文件</Button>
      <Button type="primary" onClick={() => deleteFile(5)}>删除文件</Button>
      <Button type="primary" onClick={() => undoFile(2)}>恢复文件</Button>
      <Button type="primary" onClick={() => newDownLoad(4)}>下载文件</Button>
    </div>
    <Button onClick={()=>{let i=window.crypto.randomUUID();console.log(i);setTestKey(i)}}></Button>
    <Test key={testKey}></Test>
  </main>
)
}
