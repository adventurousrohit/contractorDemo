// pages/index.js
import { getAllUser } from "@/app/utils/api";
import React, { useState } from "react";
interface Contract {
  title: string;
  contractorName: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface allUser {
  name: string;
  value: number;
}

interface ContractListProps {
  data: Contract[];
  isAdmin: boolean;
  handleDelete:  (contractId: number) => void;
  handleApprove:  (contractId: number, isApprove:boolean) => void;
  getContractHandler:  (page?: number,pageSize?: number, status?:string, userId?:any) => void;
  allUser:allUser[];
  pagination:any
}

const TableWithPagination: React.FC<ContractListProps> = ({
  data,
  handleDelete,
  isAdmin,
  handleApprove,
  getContractHandler,
  allUser,
  pagination
}) => {


React.useEffect(()=>{
  setSelecteduser(allUser[0]?.value)
},[])

  const option = [
    {
      name: "Pending",
      value: "pending",
    },
    {
      name: "Failed",
      value: "failed",
    },
    {
      name: "Success",
      value: "success",
    },
  ];
  
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedUser, setSelecteduser] = useState<any>();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Items per page

  // Change page
  const paginate = (pageNumber: any) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4">
<div className="container mx-auto p-4">
  {/* First Dropdown on the left */}
  <div className="mb-4">
    <label htmlFor="city" className="mr-2">
      Filter by Status:
    </label>
    <select
      id="Pending"
      className="p-2 border rounded-md"
      value={selectedStatus}
      onChange={(e) => {getContractHandler(0, 10, e.target.value); setSelectedStatus(e.target.value)}}
    >
      <option value="All">All</option>
      {option.map((data, key) => (
        <option key={key} value={data?.value}>
          {data?.name}
        </option>
      ))}
    </select>
  </div>

  {/* Second Dropdown aligned to the right */}
  {isAdmin && 
    <div className="mb-4 flex justify-end">
    <label htmlFor="city" className="mr-2">
      Filter by User:
    </label>
    <select
      id="Pending"
      className="p-2 border rounded-md"
      value={selectedUser}
      onChange={(e) => {getContractHandler(0, 10,'',e.target.value); setSelecteduser(e.target.value)}}
    >
      {/* <option value="All">All</option> */}
      {allUser?.map((data, key) => (
        <option key={key} value={data?.value}>
          {data?.name}
        </option>
      ))}
    </select>
  </div>}

</div>



      {/* Table */}
      <table className="min-w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Title</th>
            <th className="px-4 py-2 border-b">Contractor Name</th>
            <th className="px-4 py-2 border-b">Start Date</th>
            <th className="px-4 py-2 border-b">End Date</th>
            <th className="px-4 py-2 border-b">Status</th>
            <th className="px-4 py-2 border-b">Delete</th>
            {isAdmin && <th className="px-4 py-2 border-b">Approve/Reject</th>}
          </tr>
        </thead>
        <tbody>
          {data &&
            data?.map((item: any, key) => (
              <tr key={key} className="border-b">
                <td className="px-4 py-2">{item.title}</td>
                <td className="px-4 py-2">{item.contractorName}</td>
                <td className="px-4 py-2">{item.startDate}</td>
                <td className="px-4 py-2">{item.endDate}</td>
                <td className="px-4 py-2">
                  <button
                    className={`px-4 py-2 rounded text-white font-semibold 
      ${
        item?.status?.toLowerCase() === "approved"
          ? "bg-green-500 hover:bg-green-600" 
          : item?.status?.toLowerCase()  === "rejected"
          ? "bg-red-500 hover:bg-red-600" 
          : "bg-gray-500 hover:bg-gray-600" 
      }`}
                  >
                    {item?.status?.toUpperCase()}
                  </button>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => {
                      handleDelete(item?.id);
                    }}
                    className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </td>
                {isAdmin && (
                  <td className="px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => { handleApprove(item?.id, true) }}
                      className="text-white bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg focus:outline-none"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => { handleApprove(item?.id, false) }}
                      className="text-white bg-yellow-500 hover:bg-yellow-600 px-6 py-2 rounded-lg focus:outline-none"
                    >
                      Reject
                    </button>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-center space-x-2">
        <button
          className="p-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          disabled ={pagination?.currentPage === 1}
          onClick={() => getContractHandler(currentPage > 1 ? currentPage - 1 : 1)}
        >
          Previous
        </button>
        {[...Array(pagination?.totalPages)].map((_, index) => (
          <button
            key={index}
            className={`p-2 rounded-lg ${pagination?.currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => getContractHandler(pagination?.currentPage-1, 10,'', isAdmin&&selectedUser)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="p-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          disabled = {pagination?.currentPage ==Math.ceil(pagination?.totalContracts/10) }
          onClick={() => getContractHandler(pagination?.currentPage+1, 10,'', isAdmin&&selectedUser)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TableWithPagination;
