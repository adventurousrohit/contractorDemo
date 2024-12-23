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
  } catch (error:any) {
    if (error.response) {
      if (error.response.status === 404) {
        console.error('Error: Endpoint not found');
      } else if (error.response.status === 500) {
        console.error('Internal Server Error: Something went wrong.');
      } else {
        console.error(`HTTP Error ${error.response.status}: ${error.response.data}`);
      }
    } else if (error.request) {
      console.error('No response from server');
    } else {
      console.error('Error setting up request:', error.message);
    }

    // You can throw an error to propagate it further if needed
    throw error;
  }
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
