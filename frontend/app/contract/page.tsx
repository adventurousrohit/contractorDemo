"use client";
import React from "react";
import {
  getContract,
  deleteContract,
  approveOrReject,
  getAllUser,
} from "../utils/api";
import { getCookieWithKey } from "../utils/cookie";
import TableWithPagination from "@/components/Table";

// import { Button, Input, Container, Card, CardHeader, CardBody, CardFooter } from '@comp';

const contract = () => {
  const [pageinationData, setPaginationData] = React.useState();
  const [pageSize, setpageSize] = React.useState(10);
  const [totalRecord, setTotalRecord] = React.useState(null);
  const [data, setData] = React.useState([]);
  const [allUser, setAllUser] = React.useState<any>([]);
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    const user = getCookieWithKey("user");
    if (user) {
      const userData = JSON.parse(user);
      console.log("userData", userData?.roles);
      const isAdmin = userData?.roles?.some((obj: any) => obj.name === "Admin");
      if (isAdmin) {
        setIsAdmin(isAdmin);
        getAllUsers().then((data) => {
          const userId = data?.[0]?.id;
          getContractHandler(0, 10, "", userId);
        });
      }else {
        getContractHandler(0, 10);
      }
      console.log("isAdmin", isAdmin);
    } 
  }, []);
  const getAllUsers = async () => {
    const resp = await getAllUser();
    if (resp) {
     const dataList = resp?.map((data:any)=>{
      const a ={name:data?.name, value:data?.id}
      return a
      })
      setAllUser(dataList);
      return resp;
    }
  };

  const getContractHandler = async (
    page?: number,
    pageSize?: number,
    status?: string,
    userId?: number
  ) => {
    try {
      const data = {
        page: page,
        pageSize: pageSize,
        status: status,
        userId: userId,
      };
      console.log("checkingData", data)
      const resp = await getContract(data);
      if (resp) {
        const { contracts, pagination } = resp;
        setData(contracts);
        setPaginationData(pagination);
        // setpageSize(pagination?.pageSize);
        // setTotalRecord(pagination?.totalContracts);
      }
    } catch (e) {
      console.log("Error from login page", e);
    }
  };

  // 2. Delete handler function
  const handleDelete = async (id: number) => {
    try {
      const response = await deleteContract(id);

      if (response?.status === 200) {
        alert("Contract deleted successfully");
        const userId = isAdmin && allUser?.[0]?.value
        getContractHandler(0,10,"", userId);
      }
    } catch (error) {
      console.error("Error deleting contract", error);
      alert("Error deleting contract");
    }
  };

  // 2. Delete handler function
  const handleApproveOrReject = async (
    contractId: number,
    isApproved: Boolean,
    userId?: number
  ) => {
    try {
      const response = await approveOrReject(contractId, isApproved);

      if (response?.status === 200) {
        alert("Contract Updated successfully");
        const userId = isAdmin && allUser?.[0]?.value
        getContractHandler(0,10,"", userId);
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
          getContractHandler={getContractHandler}
          allUser ={allUser}
          pagination = {pageinationData}
        />
      </div>
    </>
  );
};

export default contract;
