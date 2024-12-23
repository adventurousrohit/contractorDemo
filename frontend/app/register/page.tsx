"use client"
import { useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
  } from "@/components/ui/card"


// import { Button, Input, Container, Card, CardHeader, CardBody, CardFooter } from '@comp';

const LoginPage = () => {

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <h2 className="text-xl font-bold">Register</h2>
        </CardHeader>
        <CardContent>
          <h1>We will start registering to user soonly</h1>
        </CardContent>
        {/* <CardFooter>
          <p className="text-sm text-center">
            Don't have an account? <a href="/register" className="text-blue-500">Register</a>
          </p>
        </CardFooter> */}
      </Card>
    </div>
  );
};

export default LoginPage;
