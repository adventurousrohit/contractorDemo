// pages/index.js
import { useState } from "react";
interface Contract {
  title: string;
  contractorName: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface ContractListProps {
  data: Contract[];
  isAdmin: Boolean;
  handleDelete: Function;
  handleApprove: Function;
}

const TableWithPagination: React.FC<ContractListProps> = ({
  data,
  handleDelete,
  isAdmin,
  handleApprove
}) => {
  // Sample data (replace with actual data)
  // const data = [
  //   {
  //     "title": "contrac1",
  //     "contractorName": "John Doe",
  //     "startDate": "2024-01-15",
  //     "endDate": "2024-12-31"
  //   },
  //   {
  //     "title": "contrac2t2",
  //     "contractorName": "Jane Smith",
  //     "startDate": "2024-02-01",
  //     "endDate": null
  //   },
  //   {
  //     "title": "contrac2t3",
  //     "contractorName": "Alice Johnson",
  //     "startDate": "2023-11-10",
  //     "endDate": "2024-06-30"
  //   },
  //   {
  //     "contractorName": "Bob Brown",
  //     "startDate": "2024-03-05",
  //     "endDate": null
  //   },
  //   {
  //     "contractorName": "Charlie Davis",
  //     "startDate": "2024-04-12",
  //     "endDate": "2024-08-31"
  //   }
  // ];

  const option = [
    {
      name: "pending",
      value: "Pending",
    },
    {
      name: "failed",
      value: "Failed",
    },
    {
      name: "success",
      value: "Success",
    },
  ];
  const [selectedCity, setSelectedCity] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Items per page

  // Change page
  const paginate = (pageNumber: any) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto p-4">
      {/* Dropdown */}
      <div className="mb-4">
        <label htmlFor="city" className="mr-2">
          Filter by Status:
        </label>
        <select
          id="city"
          className="p-2 border rounded-md"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="All">All</option>
          {option.map((data, key) => (
            <option key={key} value={data?.value}>
              {data?.name}
            </option>
          ))}
        </select>
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
          onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
        >
          Previous
        </button>
        {/* {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`p-2 rounded-lg ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </button>
        ))} */}
        <button
          className="p-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          //   onClick={}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TableWithPagination;
