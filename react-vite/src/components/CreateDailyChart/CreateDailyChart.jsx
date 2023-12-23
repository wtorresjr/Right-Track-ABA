import { useDispatch, useSelector } from "react-redux";
import { getClientByIDThunk } from "../../redux/clients";
import { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";

const CreateDailyChart = () => {
  const { client_id } = useParams();
  const currentClient = useSelector((state) => state?.clients?.client_by_id);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getClientByIDThunk(client_id));
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Clicked");
  };

  return (
    <div className="mainDisplayContain">
      <h1>
        Create Daily Chart For {currentClient?.first_name}{" "}
        {currentClient?.last_name}
      </h1>
      {currentClient?.Incomplete_Charts &&
        currentClient?.Incomplete_Charts?.map((incChart) => {
          return (
            <div>
              <label>Incomplete Charts for {currentClient?.first_name}: </label>
              <NavLink
                to={`/daily-chart/${incChart?.id}`}
                className="navLinkStyle"
              >
                {incChart?.chart_date}
              </NavLink>
            </div>
          );
        })}

      {currentClient && !currentClient?.message ? (
        <form onSubmit={handleSubmit}>
          <button>Create Chart</button>
        </form>
      ) : (
        <h1>{currentClient?.message}</h1>
      )}
    </div>
  );
};

export default CreateDailyChart;
