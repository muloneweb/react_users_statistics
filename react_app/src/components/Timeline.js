import Selectwar from './Selectwar.js';
import React from "react"
import '../index.css';
import { Line } from 'react-chartjs-2';

export const Timelines = React.memo(({ timespa }) => {

  let loading = <>  <div class="razar">
    <div class="ringbase ring1"></div>
    <div class="ringbase ring2"></div>
    <div class="pulse"></div>
    <div class="pointer">
      <div></div>
    </div>
    <div class="dot pos1"></div>
    <div class="dot pos2"></div>
  </div></>

  return (
    <div className="graphschart" key={1} style={{ display: "block", borderRadius: "5px", position: "relative", width: "50%" }}>

      <Line
        data={timespa}
        options={{
          type: 'line',
          options: {
            elements: {
              point: {
                radius: 0
              }
            },
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },

              title: {
                display: true,
                text: 'Chart.js Line Chart'
              }
            }
          },
          responsive: true,
          maintainAspectRatio: false,
        }}
      />

    </div>
  );
})

