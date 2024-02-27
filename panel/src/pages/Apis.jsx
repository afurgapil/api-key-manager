import { useState, useEffect } from "react";
import { MdAdd } from "react-icons/md";
import { IoCloseOutline } from "react-icons/io5";
import { useUser } from "../hooks/useUser";
import { useToken } from "../hooks/useToken";
import { useLimit } from "../hooks/useLimit";
import { USER_API } from "../urls";
import { FaPenAlt, FaTrashAlt } from "react-icons/fa";
function Apis() {
  const user = useUser();
  const token = useToken();
  const limit = useLimit();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [endpointList, setEndpointList] = useState([]);
  const [formData, setFormData] = useState({
    userId: user.id,
    url: "",
    key: "",
  });
  const [editedEndpointId, setEditedEndpointId] = useState(null);
  useEffect(() => {
    if (token && user) {
      fetchEndpoints();
    }
  }, [user, token]);

  const fetchEndpoints = async () => {
    try {
      const response = await fetch(`${USER_API.GET_ALL_ENDPOINT}/${user.id}`, {
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
      setEndpointList(data.data);
    } catch (error) {
      console.error("Error creating path: ", error.message);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("sonuc", limit - endpointList.length);

    try {
      const response = await fetch(USER_API.ADD_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Request failed");
      }

      // If the response is OK, handle the data accordingly (e.g., show success message, update UI)
      const data = await response.json();
      if (data.message == "Path created.") {
        setFormData({
          userId: user.id,
          url: "",
          key: "",
        });
        closeModal("add");
        fetchEndpoints();
      }
    } catch (error) {
      // Handle errors (e.g., show error message, update UI)
      console.error("Error creating path: ", error.message);
    }
  };
  const handleRemove = async (endpointId) => {
    try {
      const response = await fetch(
        `${USER_API.DELETE_ENDPOINT}/${endpointId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            userId: user.id,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Path deleted.");
      } else {
        fetchEndpoints();
      }
    } catch (error) {
      // Handle errors (e.g., show error message, update UI)
      console.error("Error creating path: ", error.message);
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const openEdit = (dataItem) => {
    setFormData({
      userId: user.id,
      url: dataItem.url,
      key: dataItem.key,
    });
    setEditedEndpointId(dataItem.id);
    openModal("update");
  };
  const saveEdit = async () => {
    try {
      console.log(formData);
      const response = await fetch(
        `${USER_API.EDIT_ENDPOINT}/${editedEndpointId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(formData),
        }
      );
      console.log("formdata", formData);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Path updated.");
      } else {
        closeModal("update");
        fetchEndpoints();
        setEditedEndpointId(null);
      }
    } catch (error) {
      // Handle errors (e.g., show error message, update UI)
      console.error("Error creating path: ", error.message);
    }
  };
  const openModal = (type) => {
    switch (type) {
      case "add":
        setIsAddModalOpen(true);
        break;
      case "update":
        setIsUpdateModalOpen(true);
        break;
      default:
        break;
    }
  };

  const closeModal = (type) => {
    switch (type) {
      case "add":
        setIsAddModalOpen(false);
        break;
      case "update":
        setIsUpdateModalOpen(false);
        setEditedEndpointId(null);
        break;
      default:
        break;
    }
    setFormData({
      userId: user.id,
      url: "",
      key: "",
    });
  };

  return (
    <div className="min-h-screen w-full py-8 px-8 flex flex-col justify-start items-center bg-neutral-50 dark:bg-slate-300">
      <div className="flex flex-row justify-between items-center w-full border-b-2 border-black">
        <h1 className="font-bold text-3xl">Endpoints List</h1>
        <button
          type="button"
          disabled={!(limit - endpointList.length > 0)}
          onClick={() => {
            openModal("add");
          }}
          className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4  font-medium rounded-full text-sm px-3 py-1 text-center me-2 mb-2 dark:bg-gray-600 dark:hover:bg-gray-700 "
        >
          <MdAdd className="text-2xl" />
        </button>
      </div>
      <div className="w-full">
        {limit && (
          <div className="bg-lightGreen text-green-800 dark:bg-lightGray dark:text-gray-800  text-2xl text-center font-medium me-2 px-2.5 py-0.5 rounded  my-2">
            {endpointList.length}/{limit}
          </div>
        )}

        {endpointList.length > 0 ? (
          <div className="w-full">
            <ul className="w-full flex flex-col justify-start items-center gap-y-4">
              {endpointList.map((dataItem) => (
                <li
                  key={dataItem.id}
                  className="flex flex-row justify-between items-center py-2 gap-x-12 border-b border-gray-400 w-full"
                >
                  <div className="flex flex-col py-1">
                    <h5>
                      <span className="font-bold">Endpoint ID:</span>
                      {dataItem.id}
                    </h5>
                    <p>
                      <span className="font-bold">URL:</span>
                      {dataItem.url}
                    </p>
                    <p>
                      <span className="font-bold">Key:</span>
                      {dataItem.key}
                    </p>
                  </div>
                  <div className="flex flex-row justify-center items-center gap-x-4">
                    <button
                      className="bg-green-400 text-green-950 dark:bg-lightSecondary dark:text-white rounded-2xl p-4 hover:cursor-pointer hover:bg-green-500"
                      onClick={() => {
                        openEdit(dataItem);
                      }}
                    >
                      <FaPenAlt className="text-2xl"></FaPenAlt>
                    </button>
                    <button
                      className=" bg-red-400 text-red-950 dark:bg-red-700 dark:text-white rounded-2xl p-4 hover:cursor-pointer hover:bg-red-500"
                      onClick={() => {
                        handleRemove(dataItem.id);
                      }}
                    >
                      <FaTrashAlt className="text-2xl"></FaTrashAlt>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No data received yet.</p>
        )}
      </div>
      {/* Add Modal */}
      <div
        id="crud-modal"
        tabIndex="-1"
        aria-hidden={!isAddModalOpen}
        className={`${
          isAddModalOpen ? "flex mt-20" : "hidden"
        } overflow-y-auto overflow-x-hidden absolute top-1/2 right-1/2  z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create New Product
              </h3>
              <button
                type="button"
                onClick={() => {
                  closeModal("add");
                }}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="crud-modal"
              >
                <IoCloseOutline className="text-3xl" />
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <form className="p-4 md:p-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label
                    htmlFor="url"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    URL
                  </label>
                  <input
                    type="text"
                    name="url"
                    id="url"
                    value={formData.url}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Enter URL"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="key"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Key
                  </label>
                  <input
                    type="text"
                    name="key"
                    id="key"
                    value={formData.key}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Enter key"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Add new product
              </button>
            </form>
          </div>
        </div>
      </div>{" "}
      {/* Update Modal */}
      <div
        id="crud-modal"
        tabIndex="-1"
        aria-hidden={!isUpdateModalOpen}
        className={`${
          isUpdateModalOpen ? "flex mt-20" : "hidden"
        } overflow-y-auto overflow-x-hidden absolute top-1/2 right-1/2  z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Update Product
              </h3>
              <button
                type="button"
                onClick={() => {
                  closeModal("update");
                }}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-toggle="crud-modal"
              >
                <IoCloseOutline className="text-3xl" />
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <form
              className="p-4 md:p-5"
              onSubmit={(e) => {
                e.preventDefault();
                saveEdit(editedEndpointId);
              }}
            >
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label
                    htmlFor="url"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    URL
                  </label>
                  <input
                    type="text"
                    name="url"
                    id="url"
                    value={formData.url}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Enter URL"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="key"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Key
                  </label>
                  <input
                    type="text"
                    name="key"
                    id="key"
                    value={formData.key}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Enter key"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Update product
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Apis;
