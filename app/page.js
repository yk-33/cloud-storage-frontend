'use client'
import React ,{useEffect}from 'react';
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  //router.replace('/log-in')
  useEffect(()=>{
    router.replace('/log-in')
     }, [])
return (
  <div></div>
)
}
