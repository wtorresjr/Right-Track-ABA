
const IntervalComponent = () => {
    return (

  )
};
export default IntervalComponent

//     {
//   chartIntervals &&
//     chartIntervals?.map((interval) => {
//       return (
//         <div key={interval?.id} className="intervalInfoContain">
//           <div className="intervalHeader">
//             <label>
//               Interval Time: {interval?.start_interval} -{" "}
//               {interval?.end_interval}
//             </label>{" "}
//             |<label> Activity: {interval?.activity} </label>|
//             <label> Interval Rating: {interval?.interval_rating}</label>
//           </div>
//           <p>
//             <label>Interval Notes:</label> {interval?.interval_notes}
//           </p>
//           <label>Problem Behaviors: </label>

//           {Object.keys(interval?.interval_tags).length ? (
//             <p className="behaviorsTag">
//               {Object.entries(interval?.interval_tags || {}).map(
//                 ([behavior, count]) => (
//                   <div key={behavior}>
//                     <div>
//                       {behavior}: {count}
//                     </div>
//                   </div>
//                 )
//               )}
//             </p>
//           ) : (
//             "None."
//           )}
//         </div>
//       );
//     });
// }