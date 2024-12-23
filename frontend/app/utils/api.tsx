"use client";
import axios from "axios";
import {getCookieWithKey, removeCookieWithKey}  from '../utils/cookie'

export const login = async (username:string, password:string) => {
  try {
    const response = await axios.post(`/api/auth/login`, {
      email:username,
      password:password,
    });
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

export const getContract = async (data?:any) => {
  try {
    let url = `/api/contract/get/contract`
     const token = getCookieWithKey('token')

    if (data?.status) {
      url += "?status=" + encodeURIComponent(data.status); // Add `status` as a query parameter
    }
    if (data?.id) {
      url += (data?.status ? "&" : "?") + "id=" + encodeURIComponent(data.id);
    }
    
    if (data?.page) {
      url += (data?.status || data?.id ? "&" : "?") + "page=" + encodeURIComponent(data.page);
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
    const response = await axios.put(`/api/contract/delete/contract/${contractId}?isApproved=${isApproved}`, {
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
