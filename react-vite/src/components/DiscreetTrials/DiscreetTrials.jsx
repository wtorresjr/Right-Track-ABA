const DiscreetTrials = ({ clientDT }) => {
  return (
    <>
      <h1>Discreet Trials</h1>
      {clientDT &&
        clientDT?.Discreet_Trials?.map((dt) => {
          return <div key={dt.id}>{dt?.trial_date}</div>;
        })}
    </>
  );
};

export default DiscreetTrials;
