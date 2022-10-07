import React from "react"
import '../index.css';
import HeatMap from 'react-heatmap-grid';

export const Heatmapchart = React.memo(({ timespans }) => {
  let yLabels
  let xLabels
  let data
  try {
    yLabels = ["1:00", "2:00", "3:00", "4:00", "5:00", "6:00", "7:00", "8:00", "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00",
      "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "24:00"]

     xLabels = timespans[0][0].map((e, i) => i + 1) //funcCall[1]
    data = timespans[0]
  } catch (e) {
    console.log(e)
  }
    return (
      <div className="Heatmap">
        {timespans.length > 0 ? <HeatMap xLabels={xLabels} yLabelsfontSize={9} height={8} yLabels={yLabels} data={data} /> : null}
      </div>
    )


})