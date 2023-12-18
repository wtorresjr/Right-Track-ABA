import { NavLink } from "react-router-dom";
const DiscreetTrials = ({ clientDT }) => {
  return (
    <>
      <h1>Discreet Trials</h1>
      {clientDT &&
        clientDT?.Discreet_Trials?.map((dt) => {
          return (
            <div key={dt.id}>
              <NavLink
                to={`/discreet-trial/${dt.id}`}
                className="navLinkStyleDC"
              >
                <div className="dcButtons">
                  <div> {dt?.trial_date}</div>
                  <div>{dt?.program_name}</div>
                  View Trial(s)
                </div>
              </NavLink>
            </div>
          );
        })}
    </>
  );
};

export default DiscreetTrials;
