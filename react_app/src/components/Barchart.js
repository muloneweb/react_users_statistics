
import React from "react"
import '../index.css';
import { Bar } from "react-chartjs-2";

export const BarChart = React.memo(({ chartData }) => {

  return (
    <div className="graphschart" style={{ borderRadius: "5px", marginBottom: "8px" }}>
      <Bar
        data={chartData}
        options={{
          categoryPercentage: 0.8,
          barPercentage: 0.6,
          scales: {
            x: {
              ticks: {
                display: false,
              }
            },
            y: {
              ticks: {
                display: false,
              }
            }
          },
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'x',
          plugins: {
            title: {
              display: false,
              text: "time"
            },
            legend: {
              display: false,
            }
          }
        }}
      />
    </div>
  );
});
