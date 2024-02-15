import { NavLink, useParams } from "react-router-dom";
import "../DailyCharts/daily-chart.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getAllDTsThunk } from "../../redux/dts";
import { returnPercentColor } from "../helpers/returnColor";

const DiscreetTrials = () => {
  const { client_id } = useParams();
  const dispatch = useDispatch();
  const clientDT = useSelector((state) => state?.dt?.Discreet_Trials);

  useEffect(() => {
    dispatch(getAllDTsThunk(client_id));
  }, []);

  return (
    <div className="chartsContain">
      <h1>
        Discreet Trials
        <button id="createNewChartBtn">New Discreet Trial</button>
      </h1>

      {clientDT && clientDT?.length
        ? clientDT.map((dt) => {
            return (
              <div key={dt.id}>
                <NavLink
                  to={`/discreet-trial/${dt.id}`}
                  className="navLinkStyleDC"
                >
                  <div
                    className="dcButtons"
                    style={{
                      border: `3px solid ${returnPercentColor(dt?.trials_avg)}`,
                    }}
                  >
                    <div> {dt?.trial_date}</div>
                    <div>{dt?.program_name}</div>
                    <div>Mastery: {dt?.trials_avg}%</div>
                    View Trial(s)
                  </div>
                </NavLink>
              </div>
            );
          })
        : "No Discreet Trials Yet"}
    </div>
  );
};

// const DiscreetTrials = ({ clientDT }) => {
//   return (
//     <div className="chartsContain">
//       <h1>
//         Discreet Trials
//         <button id="createNewChartBtn">New Discreet Trial</button>
//       </h1>

//       {clientDT &&
//         clientDT?.Discreet_Trials?.map((dt) => {
//           console.log(dt, "Client DTs");
//           return (
//             <div key={dt.id}>
//               <NavLink
//                 to={`/discreet-trial/${dt.id}`}
//                 className="navLinkStyleDC"
//               >
//                 <div className="dcButtons">
//                   <div> {dt?.trial_date}</div>
//                   <div>{dt?.program_name}</div>
//                   <div>{dt?.trials_avg}</div>
//                   View Trial(s)
//                 </div>
//               </NavLink>
//             </div>
//           );
//         })}
//     </div>
//   );
// };

export default DiscreetTrials;
