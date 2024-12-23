"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getContract, deleteContract, approveOrReject } from "../utils/api";
import { getCookieWithKey } from "../utils/cookie";
import TableWithPagination from "@/components/Table";
import { DropdownMenuCheckboxes } from "@/components/DropDown";

// import { Button, Input, Container, Card, CardHeader, CardBody, CardFooter } from '@comp';

const contract = () => {
  const [page, setpage] = React.useState(0);
  const [pageSize, setpageSize] = React.useState(10);
  const [totalRecord, setTotalRecord] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const user = getCookieWithKey("user");
    if (user) {
      const userData = JSON.parse(user);
      console.log("userData", userData?.roles);
      const isAdmin = userData?.roles?.find((item: any) =>
        item.name.toLowerCase().includes("admin")
      );
      setIsAdmin(isAdmin)
    }
    getContractHandler();
  }, [page]);

  const getContractHandler = async () => {
    try {
      const data = { page: page, pageSize: pageSize };
      const resp = await getContract(data);
      if (resp) {
        console.log("resp", resp);
        const { contracts, pagination } = resp;
        setData(contracts);
        setpage(pagination?.currentPage);
        setpageSize(pagination?.pageSize);
        setTotalRecord(pagination?.totalContracts);
        // setCookieWithKey(access_token, 'token')
        // setCookieWithKey(user, 'user')
      }
    } catch (e) {
      console.log("Error from login page", e);
    }
  };

  // 2. Delete handler function
  const handleDelete = async (id: number) => {
    try {
      const response = await deleteContract(id);

      if (response.status === 200) {
        alert("Contract deleted successfully");
        getContractHandler();
      }
    } catch (error) {
      console.error("Error deleting contract", error);
      alert("Error deleting contract");
    }
  };


    // 2. Delete handler function
    const handleApproveOrReject = async (contractId: number, isApproved:Boolean) => {
      try {
        const response = await approveOrReject(contractId, isApproved);
  
        if (response.status === 200) {
          alert("Contract Updated successfully");
          getContractHandler();
        }
      } catch (error) {
        console.error("Error deleting contract", error);
        alert("Error deleting contract");
      }
    };

  return (
    <>
      <div>
        {/* <DropdownMenuCheckboxes/> */}
        <TableWithPagination
          data={data}
          handleDelete={handleDelete}
          isAdmin={isAdmin}
          handleApprove={handleApproveOrReject}
        />
      </div>
    </>
  );
};

export default contract;
