import React from "react"
import '../index.css'
import { Bar } from "react-chartjs-2"

export const Barshours = React.memo(({ charthours }) => {
  return (
    <div className="graphs" style={{ minHeight: "280px" }}>
      <Bar
        data={charthours}
        options={{
          legend: {
            fontColor: "#d1d1d1",
          },
          categoryPercentage: 0.5,
          barPercentage: 0.9,
          scales: {
            x: {
              title: {
                text: "Wars",
                align: "start"
              },
              stacked: false,
              ticks: {
                color: '#d1d1d1',
                display: true,
              }
            },
            y: {
              stacked: false,
              ticks: {
                color: '#d1d1d1',
                display: true,
              }
            }
          },
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'x',
          plugins: {
            legend: {
              title: {
                color: "#d1d1d1",
                text: "aaaa",
              },
              labels: {
                color: "#d1d1d1",
                boxWidth: 10,
                boxHeight: 10,
              },
              display: true,
              color: "#143f60",
              position: "top"
            }
          }
        }}
      />
    </div>
  );
});
