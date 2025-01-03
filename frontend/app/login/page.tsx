"use client"
import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
  } from "@/components/ui/card"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { login } from '../utils/api';
import {setCookieWithKey} from '../utils/cookie'
import { useRouter } from 'next/navigation';

import {getCookieWithKey}  from '../utils/cookie'


// import { Button, Input, Container, Card, CardHeader, CardBody, CardFooter } from '@comp';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] =  React.useState('')
  const router = useRouter()


  React.useEffect(()=>{
    const token = getCookieWithKey('token')
    if(token){
      router.push('/contract')
    }

  },[])

  const handleLogin = async(e:any) => {
    e.preventDefault();
    try{
      const resp = await login(email, password)
      if(resp.status !=200){
        setError('invalid Credentials')
      }
      if(resp?.data){
        setError('')
        console.log('resp',resp)
        const {access_token, user} = resp?.data
        setCookieWithKey(JSON.stringify(access_token), 'token')
        setCookieWithKey(JSON.stringify(user), 'user')
        router.push('/contract')
        
      }
    }catch(e:any){
      if(e?.status !=200){
        setError('invalid Credentials')
      }
      console.log("Error from login page", e)
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <h2 className="text-xl font-bold">Login</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e:any) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full"
              />
              {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            </div>
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </CardContent>

        <CardFooter>
          <p className="text-sm text-center">
            Don't have an account? <Link href="/register" className="text-blue-500">Register</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
