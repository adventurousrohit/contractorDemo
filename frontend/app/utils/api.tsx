"use client";
import axios from "axios";
import {getCookieWithKey, removeCookieWithKey}  from '../utils/cookie'

export const login = async (email:string, password:string) => {
  // try {
    const response = await axios.post(`/api/auth/login`, {
      email:email,
      password:password,
    });
    return response;
};

export const getContract = async (data?:any) => {
  try {
    let url = `/api/contract/get/contract`
     const token = getCookieWithKey('token')
     
     console.log("afl;ncsz", data)
     if (data?.page ==0 || data?.page ) {
      url += "?page=" + encodeURIComponent(data.page);
    }
    if (data?.pageSize) {
      url += (data?.page ? "&" : "?") + "pageSize=" + encodeURIComponent(data.pageSize);
    }
    if (data?.status) {
      url += (data?.page ==0 || data?.page  || data?.pageSize ? "&" : "?") + "status=" + encodeURIComponent(data.status); // Add `status` as a query parameter
    }

    if (data?.userId) {
      url += (data?.status || data?.pageSize || data?.page ==0 || data?.page  ? "&" : "?") + "userId=" + encodeURIComponent(data.userId);
    }
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(token)}`, 
        'Content-Type': 'application/json', 
      }});
      if(response?.status ==401){
        redirectTologin()
        return
      }
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    // throw error;
  }
};

export const getAllUser = async (data?:any) => {
  try {
    const token = getCookieWithKey('token')
    let url = `/api/contract/get/all/user`

    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(token)}`, 
        'Content-Type': 'application/json', 
      }});
      if(response?.status ==401){
        redirectTologin()
        return
      }
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    // throw error;
  }
};


export const deleteContract = async (contractId:number) => {
  try {
    const token = getCookieWithKey('token')
    const response = await axios.delete(`/api/contract/delete/contract/${contractId}`, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(token)}`, 
        'Content-Type': 'application/json', 
      },
    });
    if(response?.status ==401){
      redirectTologin()
      return
    }
    return response;
  } catch (error) {
    console.error("Error during login:", error);
    // throw error;
  }
};

export const approveOrReject = async (contractId:number, isApproved:Boolean) => {
  try {
    const token = getCookieWithKey('token')
    const response = await axios.put(`/api/contract/update/status/${contractId}?isApproved=${isApproved}`,{}, {
      headers: {
        'Authorization': `Bearer ${JSON.parse(token)}`, 
        'Content-Type': 'application/json', 
      },
    });
    if(response?.status ==401){
      redirectTologin()
      return
    }
    return response;
  } catch (error) {
    console.error("Error during login:", error);
    // throw error;
  }
};


const redirectTologin = () => {
  removeCookieWithKey('token')
  removeCookieWithKey('user')
  window.location.href = '/login'
}
