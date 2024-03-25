import { useEffect, useState } from "react";
import { AiOutlineApi } from "react-icons/ai";
import { ImStatsBars } from "react-icons/im";
import { FaDollarSign } from "react-icons/fa";
import { useUser } from "../hooks/useUser";
import { useToken } from "../hooks/useToken";
import { useTier } from "../hooks/useTier";
import { useLimit } from "../hooks/useLimit";
import { USER_API } from "../constant/urls";
import Chart from "react-apexcharts";
import ErrorLogs from "../components/ErrorLogs";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
function Dashboard() {
  const { t } = useTranslation();
  const token = useToken();
  const user = useUser();
  const tier = useTier();
  const limit = useLimit();
  const [endpointList, setEndpointList] = useState([]);
  const [apiUsage, setApiUsage] = useState(null);
  const [names, setNames] = useState([]);
  const [timeInterval, setTimeInterval] = useState("all");
  const [totalCost, setTotalCost] = useState("");
  const [logs, setLogs] = useState([]);
  const [isUsageActive, setIsUsageActive] = useState(true);
  const [isPriceActive, setIsPriceActive] = useState(true);

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
  const [barChartOptions, setBarChartOptions] = useState({
    series: [
      {
        data: [],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 100,
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [],
      },
    },
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          await fetchEndpoints();
          await fetchUsage();
          await fetchLogs();
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

      const dataOne = await response.json();
      setEndpointList(dataOne.data);
      const pathIds = dataOne.data.map((item) => item.id);
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

          const dataTwo = await response.json();
          setNames(dataTwo.data);
        } catch (error) {
          console.error("Error creating path: ", error.message);
        }
      };
      fetchPathName(pathIds);
      const fetchPrices = async (array2) => {
        try {
          const response = await fetch(`${USER_API.GET_PRICES}/${user.id}`, {
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
          if (response.status === 204) {
            setIsPriceActive(false);
          }

          const dataThree = await response.json();
          const mergedArray = dataThree
            .map((obj1) => {
              const obj2 = array2.find((item) => item.id == obj1.path_id);
              if (obj2 && obj2.price !== null && obj1.usage_count !== null) {
                return {
                  id: obj1.path_id,
                  cost: obj1.usage_count * obj2.price,
                };
              } else {
                return null;
              }
            })
            .filter((obj) => obj !== null);
          const chartCosts = mergedArray.map((item) => item.cost);
          const uppercasedArray = names.map((innerArray) => {
            return innerArray.map((subArray) => {
              return subArray.map((str) => str.toUpperCase());
            });
          });
          setBarChartOptions({
            series: [
              {
                data: chartCosts,
              },
            ],
            options: {
              chart: {
                type: "bar",
                height: 100,
              },
              plotOptions: {
                bar: {
                  borderRadius: 4,
                  horizontal: true,
                },
              },
              dataLabels: {
                enabled: false,
              },
              xaxis: {
                categories: uppercasedArray,
              },
            },
          });
          const cost = mergedArray.reduce(
            (total, item) => total + item.cost,
            0
          );
          const roundedNumber = Number(Math.round(cost + "e2") + "e-2");
          setTotalCost(roundedNumber);
        } catch (error) {
          console.error("Error creating path: ", error.message);
        }
      };
      fetchPrices(dataOne.data);
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
      if (!sumValue === null) {
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
      console.log(response.status);
      if (response.status === 204) {
        setIsUsageActive(false);
        console.log(isUsageActive);
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
  return (
    <div className="min-h-screen w-full py-8 px-8 flex flex-row justify-evenly items-start bg-neutral-200 dark:bg-slate-300">
      <Helmet>
        <title> {t("helmet.dashboard.title")}</title>
        <meta name="description" lang="en" content="A page for dashboard" />
      </Helmet>
      <div id="sol" className="w-8/12 flex flex-col gap-y-12 ">
        <div
          id="sec1"
          className="bg-lightGreen dark:bg-lightGray rounded-2xl flex flex-col justify-center items-center  pb-8"
        >
          <h1 className="text-white text-2xl font-sourceSansPro font-bold leading-6 p-4 text-left w-full">
            {t("pagesDashboard.apiUsageOverview.title")}
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
                <div className="underline text-xl">
                  {t("pagesDashboard.apiUsageOverview.apiUsage.title")}
                </div>
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
                <div className="underline text-xl">
                  {t("pagesDashboard.apiUsageOverview.apiCall.title")}
                </div>
                <div className="font-bold text-2xl">{apiUsage}</div>
              </div>
            </div>
            <div
              id="api-price"
              className="flex flex-row justify-center items-center  bg-white rounded-2xl px-8 py-4 gap-x-8"
            >
              <div className="bg-lightGreen dark:bg-lightGray flex flex-col justify-center items-center rounded-full  p-4">
                <FaDollarSign className="text-3xl text-white"></FaDollarSign>
              </div>
              <div className="flex flex-col justify-center items-start">
                <div className="underline text-xl">
                  {t("pagesDashboard.apiUsageOverview.monthlyCost.title")}
                </div>
                <div className="font-bold text-2xl">
                  {totalCost ? totalCost : "N/A"}
                </div>
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
                {t("pagesDashboard.apiUsageDetails.title")}
                {!isUsageActive && (
                  <span>{t("pagesDashboard.apiUsageDetails.noDataFound")}</span>
                )}
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
                    {t("pagesDashboard.apiUsageDetails.allTime")}
                  </option>
                  <option value="1">
                    {t("pagesDashboard.apiUsageDetails.lastMonth")}
                  </option>
                  <option value="3">
                    {t("pagesDashboard.apiUsageDetails.last3Months")}
                  </option>
                  <option value="6">
                    {t("pagesDashboard.apiUsageDetails.last6Months")}
                  </option>
                  <option value="12">
                    {t("pagesDashboard.apiUsageDetails.lastYear")}
                  </option>
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
        <div
          id="sec3-prices"
          className="bg-lightGreen dark:bg-lightGray rounded-2xl flex flex-col justify-center items-center pb-8"
        >
          <div className="w-full flex flex-col items-center justify-between px-4">
            <div className="flex flex-row justify-between items-center w-full">
              <h1 className="text-white text-2xl font-sourceSansPro font-bold leading-6 p-2 text-left ">
                {t("pagesDashboard.apiPriceDetails.title")}
                {!isPriceActive && (
                  <span>{t("pagesDashboard.apiPriceDetails.noDataFound")}</span>
                )}
              </h1>
            </div>
            <div className="w-full">
              <Chart
                options={barChartOptions.options}
                series={barChartOptions.series}
                type="bar"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        id="sag"
        className="w-2/12 flex flex-col justify-center items-center px-2 py-4 gap-y-4"
      >
        <div className="w-full flex flex-col justify-center items-center bg-lightGreen dark:bg-lightGray rounded-2xl px-2 py-4">
          <div id="acc-tier">
            <h4 id="title">
              {t("pagesDashboard.yourTier.title")}
              <span className="bg-green-900 text-green-300 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-stone-900 dark:text-stone-300 uppercase">
                {tier}
              </span>
            </h4>
          </div>
        </div>
        {logs.length > 0 ? (
          <div className="w-full flex flex-col justify-center items-center gap-y-3 bg-lightGreen dark:bg-lightGray rounded-2xl ">
            <ErrorLogs logs={logs.slice(0, 4)}></ErrorLogs>
            <Link
              to="/error-logs"
              type="button"
              className="py-3 px-4 mb-4 w-10/12 text-center flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-teal-100 text-teal-800 hover:bg-teal-200 disabled:opacity-50 disabled:pointer-events-none  dark:hover:bg-gray-900 dark:text-gray-500 dark:bg-gray-300 dark:hover:text-gray-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 transition-all duration-300"
            >
              {t("pagesDashboard.errorLogs.title")}
            </Link>
          </div>
        ) : (
          <div className="w-full flex flex-col justify-center items-center gap-y-3 bg-lightGreen dark:bg-lightGray rounded-2xl px-2 py-4">
            <h1
              id="no-error-logs"
              className="flex flex-col justify-center items-center"
            >
              {t("pagesDashboard.errorLogs.noErrorRecordFound")}
            </h1>
            <Link
              to="/error-logs"
              type="button"
              className="py-3 px-4 mb-4 w-10/12 text-center flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-teal-100 text-teal-800 hover:bg-teal-200 disabled:opacity-50 disabled:pointer-events-none dark:hover:bg-gray-900 dark:text-gray-500 dark:bg-gray-300 dark:hover:text-gray-400 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600 transition-all duration-300"
            >
              {t("pagesDashboard.errorLogs.exploreAll")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
