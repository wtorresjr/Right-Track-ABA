import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllChartsThunk } from "../../redux/charts";
import "./daily-chart-all.css";

const DailyChartAll = () => {
  const dispatch = useDispatch();

  const [loaded, setLoaded] = useState(false);
  const [message, setMessage] = useState("Loading...");
  const therapistId = useSelector((state) => state?.session?.user?.id);
  const allCharts = useSelector((state) => state?.chart?.allCharts);

  useEffect(() => {
    setLoaded(false);
    let data = "";
    const getData = async () => {
      if (therapistId) {
        try {
          const data = await dispatch(getAllChartsThunk(therapistId));
          console.log(data);
          if (data?.ok) {
            setLoaded(true);
          }
          if (data?.payload?.message) {
            setMessage(data?.payload?.message);
            setLoaded(false);
          }
        } catch (error) {
          setMessage(data?.payload?.message);
          setLoaded(false);
        }
      }
    };
    getData();
  }, [dispatch, message, therapistId, loaded]);

  return (
    <div className="mainDisplayContain">
      <h2>Daily Chart All</h2>
      {loaded ? therapistId : "...loading"}
    </div>
  );
};

export default DailyChartAll;
