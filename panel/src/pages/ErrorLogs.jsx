import { useState, useEffect } from "react";
import { useUser } from "../hooks/useUser";
import { useToken } from "../hooks/useToken";
import { USER_API } from "../constant/urls";
import { FaTrashAlt } from "react-icons/fa";
function ErrorLogs() {
  const user = useUser();
  const token = useToken();
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [filteredLogs, setFilteredLogs] = useState([]);
  useEffect(() => {
    if (token && user) {
      fetchLogs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token]);
  useEffect(() => {
    const temp = logs
      .filter((log) => filter === "All" || log.company === filter)
      .sort((a, b) => {
        if (sortOrder === "newest") {
          return new Date(b.timestamp) - new Date(a.timestamp);
        } else {
          return new Date(a.timestamp) - new Date(b.timestamp);
        }
      });
    setFilteredLogs(temp);
  }, [logs, filter, sortOrder]);
  const fetchLogs = async () => {
    try {
      const response = await fetch(`${USER_API.GET_LOGS}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Request failed");
      }

      const data = await response.json();
      setLogs(data.data);
    } catch (error) {
      console.error("Error creating path: ", error.message);
    }
  };
  const handleRemove = async (logId) => {
    try {
      const response = await fetch(`${USER_API.DELETE_LOG}/${logId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Log deleted.");
      } else {
        fetchLogs();
      }
    } catch (error) {
      // Handle errors (e.g., show error message, update UI)
      console.error("Error creating path: ", error.message);
    }
  };
  const handleRemoveAll = async () => {
    try {
      const response = await fetch(`${USER_API.DELETE_ALL_LOG}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Log deleted.");
      } else {
        fetchLogs();
      }
    } catch (error) {
      // Handle errors (e.g., show error message, update UI)
      console.error("Error creating path: ", error.message);
    }
  };
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };
  return (
    <div className="min-h-screen w-full py-8 px-8 flex flex-col justify-start items-center bg-neutral-200 dark:bg-slate-300">
      <div className="flex flex-row justify-between items-center w-full border-b-2 border-black">
        <h1 className="font-bold text-3xl">Error Logs List</h1>
        <div className="flex flex-row gap-x-2 my-2">
          <form>
            <select
              className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-full text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
              onChange={handleFilterChange}
            >
              <option selected>Filter by Company</option>
              <option value="All">All</option>
              <option value="Google">Google</option>
              <option value="OpenAI">OpenAI</option>
            </select>
          </form>
          <form>
            <select
              className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-full text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
              onChange={handleSortChange}
            >
              <option selected>Sort by</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </form>
          <button
            onClick={handleRemoveAll}
            className=" bg-red-400 text-red-950 dark:bg-red-700 dark:text-white rounded-2xl px-4 hover:cursor-pointer hover:bg-red-500"
          >
            Delete All
          </button>
        </div>
      </div>
      <div className="w-full">
        {filteredLogs.length > 0 ? (
          <div className="w-full">
            <ul className="w-full flex flex-col justify-start items-center gap-y-4">
              {filteredLogs.map((dataItem) => (
                <li
                  key={dataItem.id}
                  className="flex flex-row justify-between items-center py-2 gap-x-12 border-b border-gray-400 w-full"
                >
                  <div className="flex flex-col py-1 w-2/4">
                    <div className="">
                      <span className="bg-green-600 text-black text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-stone-900 dark:text-stone-300 uppercase">
                        {dataItem.company}
                      </span>
                      /{" "}
                      <span className="bg-green-200 text-black text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-stone-600 dark:text-stone-300 uppercase">
                        {dataItem.type}
                      </span>
                    </div>
                    <h5>
                      <span className="font-bold">Log ID:</span>
                      {dataItem.id}
                    </h5>
                    <p>
                      <span className="font-bold">URL:</span>
                      {dataItem.path_id}
                    </p>
                    <p>
                      <span className="font-bold">Error Message:</span>
                      {dataItem.error_msg}
                    </p>
                    <p>
                      <span className="font-bold">Date:</span>
                      {dataItem.timestamp.slice(0, 10)}
                    </p>
                    <p>
                      <span className="font-bold">Time:</span>
                      {dataItem.timestamp.slice(11, 16)}
                    </p>
                  </div>
                  <div className="flex flex-row justify-center items-center gap-x-4">
                    <button
                      onClick={() => {
                        handleRemove(dataItem.id);
                      }}
                      className=" bg-red-400 text-red-950 dark:bg-red-700 dark:text-white rounded-2xl p-4 hover:cursor-pointer hover:bg-red-500"
                    >
                      <FaTrashAlt className="text-2xl"></FaTrashAlt>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-center font-bold text-4xl">
            No data received yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default ErrorLogs;
