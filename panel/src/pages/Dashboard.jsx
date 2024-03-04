import { useEffect, useState } from "react";
import { AiOutlineApi } from "react-icons/ai";
import { ImStatsBars } from "react-icons/im";
import { useUser } from "../hooks/useUser";
import { useToken } from "../hooks/useToken";
import { useTier } from "../hooks/useTier";
import { useLimit } from "../hooks/useLimit";
import { USER_API } from "../urls";
import Chart from "react-apexcharts";
function Dashboard() {
  const [endpointList, setEndpointList] = useState([]);
  const [apiUsage, setApiUsage] = useState(null);
  const [names, setNames] = useState([]);
  const [timeInterval, setTimeInterval] = useState("all");
  const token = useToken();
  const user = useUser();
  const tier = useTier();
  const limit = useLimit();
  const [areaChartOptions, setAreaChartOptions] = useState({
    options: {
      chart: {
        id: "area-chart",
      },
      xaxis: {
        categories: [],
      },
    },
    series: [],
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          await fetchEndpoints();
          await fetchUsage();
        }
      } catch (error) {
        console.error("Error fetching data: ", error.message);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    const fetchAndTransformData = async () => {
      try {
        if (names.length > 0) {
          await fetchPathUsage();
        }
      } catch (error) {
        console.error("Error fetching and transforming data: ", error.message);
      }
    };

    fetchAndTransformData();
  }, [names, timeInterval]);

  const transformDataForChart = (apiPathUsage) => {
    const series = apiPathUsage.map((item) => {
      const dayCounts = item.timestamps.split(",").reduce((acc, timestamp) => {
        const day = timestamp.split(" ")[0];
        if (!acc[day]) {
          acc[day] = 0;
        }
        acc[day]++;
        return acc;
      }, {});

      const data = Object.keys(dayCounts).map((day) => ({
        x: day,
        y: dayCounts[day],
      }));

      return {
        name: `${item.company.toUpperCase()}-${item.type.toUpperCase()}`,
        data,
      };
    });

    setAreaChartOptions({
      options: {
        chart: {
          id: "area-chart",
        },
        xaxis: {
          type: "datetime",
        },
      },
      series,
    });
  };

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
      const pathIds = data.data.map((item) => item.id);
      const fetchPathName = async (pathIdss) => {
        try {
          const response = await fetch(`${USER_API.GET_PATH_NAME}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify({ pathIds: pathIdss }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Request failed");
          }

          const data = await response.json();
          setNames(data.data);
        } catch (error) {
          console.error("Error creating path: ", error.message);
        }
      };
      fetchPathName(pathIds);
    } catch (error) {
      console.error("Error creating path: ", error.message);
    }
  };

  const fetchUsage = async () => {
    try {
      const response = await fetch(
        `${USER_API.GET_ALL_USAGES_ENDPOINT}/${user.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Request failed");
      }

      const data = await response.json();
      const sumValue = data.data["SUM(`usage`)"];
      if (sumValue) {
        setApiUsage(sumValue);
      } else {
        setApiUsage("N/A");
      }
    } catch (error) {
      console.error("Error creating path: ", error.message);
    }
  };
  const fetchPathUsage = async () => {
    try {
      const response = await fetch(
        `${USER_API.GET_USAGE}/${user.id}/${timeInterval}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Request failed");
      }

      const data = await response.json();
      const mergedArray = data.map((pathUsage, index) => {
        const pathName = names[index][0];
        return {
          ...pathUsage,
          company: pathName[0],
          type: pathName[1],
        };
      });
      if (response.status === 200) {
        transformDataForChart(mergedArray);
      }
    } catch (error) {
      console.error("Error creating path: ", error.message);
    }
  };

  return (
    <div className="min-h-screen w-full py-8 px-8 flex flex-row justify-evenly items-start bg-neutral-50 dark:bg-slate-300">
      <div id="sol" className="w-8/12 flex flex-col gap-y-12 ">
        <div
          id="sec1"
          className="bg-lightGreen dark:bg-lightGray rounded-2xl flex flex-col justify-center items-center  pb-8"
        >
          <h1 className="text-white text-2xl font-sourceSansPro font-bold leading-6 p-4 text-left w-full">
            API Usage Overview
          </h1>
          <div className="flex flex-row justify-between items-center gap-x-8">
            <div
              id="api-usage"
              className="flex flex-row justify-center items-center  bg-white rounded-2xl px-8 py-4 gap-x-8"
            >
              <div className="bg-lightGreen dark:bg-lightGray flex flex-col justify-center items-center rounded-full  p-4">
                <AiOutlineApi className="text-3xl text-white"></AiOutlineApi>
              </div>
              <div className="flex flex-col justify-center items-start">
                <div className="underline text-xl">API Usage</div>
                <div className="font-bold text-2xl">
                  {endpointList.length}/{limit}
                </div>
              </div>
            </div>
            <div
              id="api-keys"
              className="flex flex-row justify-center items-center  bg-white rounded-2xl px-8 py-4 gap-x-8"
            >
              <div className="bg-lightGreen dark:bg-lightGray  flex flex-col justify-center items-center rounded-full p-4">
                <ImStatsBars className="text-3xl text-white"></ImStatsBars>
              </div>
              <div className="flex flex-col justify-center items-start">
                <div className="underline text-xl">API Call</div>
                <div className="font-bold text-2xl">{apiUsage}</div>
              </div>
            </div>
          </div>
        </div>
        <div
          id="sec2"
          className="bg-lightGreen dark:bg-lightGray rounded-2xl flex flex-col justify-center items-center pb-8"
        >
          <div className="w-full flex flex-col items-center justify-between px-4">
            <div className="flex flex-row justify-between items-center w-full">
              <h1 className="text-white text-2xl font-sourceSansPro font-bold leading-6 p-2 text-left ">
                API Usage Details
              </h1>
              <form action="" className="p-2">
                <select
                  id="large"
                  className="block px-4 py-3 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={(e) => {
                    setTimeInterval(e.target.value);
                  }}
                >
                  <option selected value="all">
                    All Time
                  </option>
                  <option value="1">Last Month</option>
                  <option value="3">Last 3 Months</option>
                  <option value="6">last 6 Months</option>
                  <option value="12">Last Year</option>
                </select>
              </form>
            </div>
            <div className="w-full">
              <Chart
                options={areaChartOptions.options}
                series={areaChartOptions.series}
                type="area"
              />
            </div>
          </div>
        </div>
        <div id="sec3 tips"></div>
        <div id="sec4 update"></div>
      </div>
      <div
        id="sag"
        className="w-2/12 flex flex-col justify-center items-center px-2 py-4 gap-y-4"
      >
        <div className="w-full flex flex-col justify-center items-center bg-lightGreen dark:bg-lightGray rounded-2xl px-2 py-4">
          <div id="acc-tier">
            <h4 id="title">
              Your Tier:{" "}
              <span className="bg-green-900 text-green-300 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-stone-900 dark:text-stone-300 uppercase">
                {tier}
              </span>
            </h4>
          </div>
        </div>
        <div className="w-full flex flex-col justify-center items-center bg-lightGreen dark:bg-lightGray rounded-2xl px-2 py-4">
          <div
            id="error logs"
            className="flex flex-col justify-center items-center gap-y-4"
          >
            <div className="flex flex-col justify-start items-start border-black rounded-b-none border-b-2 rounded-2xl px-2 py-4">
              <h4 id="title">Hata</h4>
              <p id="api">DreamComment</p>
              <p id="message">303! Prompt bulunamadi!</p>
              <p id="date">12.08.2001</p>
            </div>
            <div className="flex flex-col justify-start items-start border-black rounded-b-none border-b-2 rounded-2xl px-2 py-4">
              <h4 id="title">Hata</h4>
              <p id="api">DreamComment</p>
              <p id="message">303! Prompt bulunamadi!</p>
              <p id="date">12.08.2001</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
