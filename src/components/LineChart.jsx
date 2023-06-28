import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material';
import { ResponsiveLine } from '@nivo/line';
import { tokens } from '../theme';

<<<<<<< HEAD
const LineChart = ({selectedAPI }) => {
=======
const LineChart = ({ isCustomLineColors = false, isDashboard = false, selectedAPI }) => {
>>>>>>> 5dda7cdd3d2a5101f340b37078e0a6f51d9478ba
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedAPI) return;

      try {
        const response = await fetch(selectedAPI.apiLink);
        const json = await response.json();

        if (Array.isArray(json.data) && json.data.length > 0) {
          const modifiedData = json.data.reduce((acc, item) => {
            const dateStart = item.date_start.substr(0, 7);
            const spend = Number(item.spend);
            const clicks = Number(item.clicks);

            if (acc[dateStart]) {
              acc[dateStart].spend += spend;
              acc[dateStart].clicks += clicks;
            } else {
              acc[dateStart] = {
                spend,
                clicks,
              };
            }

            return acc;
          }, {});

          const transformedData = Object.entries(modifiedData).map(([date, { spend, clicks }]) => ({
            date_start: date,
            spend,
            clicks,
          }));

          setData(transformedData);
        } else {
          console.error('Error: Invalid data format or empty data array');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    console.log(selectedAPI);

    fetchData();
  }, [selectedAPI]);


  return (
    <ResponsiveLine
      data={[
        {
          id: 'Total Spend',
          data: Array.isArray(data) ? data.map((item) => ({ x: item.date_start, y: item.spend })) : [],
        },
        {
          id: 'Total Clicks',
          data: Array.isArray(data) ? data.map((item) => ({ x: item.date_start, y: item.clicks })) : [],
        },
      ]}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.primary[100],
            },
          },
          legend: {
            text: {
              fill: colors.primary[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.primary[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.primary[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.primary[100],
          },
        },
        tooltip: {
          container: {
<<<<<<< HEAD
            color: colors.primary[100],
=======
            color: colors.primary[5100],
>>>>>>> 5dda7cdd3d2a5101f340b37078e0a6f51d9478ba
          },
        },
      }}
      margin={{ top: 35, right: 110, bottom: 15, left: 55 }} // Ajuste a margem esquerda para 80
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: 'bottom',
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legendOffset: 36,
        legendPosition: 'middle',
      }}
      axisLeft={{
        orient: 'left',
        tickValues: 5,
        tickSize: 5,
<<<<<<< HEAD
        tickPadding: 8,
=======
        tickPadding: 5,
>>>>>>> 5dda7cdd3d2a5101f340b37078e0a6f51d9478ba
        tickRotation: 0,
        legendOffset: -40,
        legendPosition: 'middle',
      }}
      enableGridX={true}
      enableGridY={false}
      pointSize={10}
<<<<<<< HEAD
=======
      pointColor={{ theme: 'background' }}
>>>>>>> 5dda7cdd3d2a5101f340b37078e0a6f51d9478ba
      pointBorderWidth={2}
      pointLabelYOffset={-12}
      enablePointLabel={true} 
      useMesh={true}
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
          symbolSize: 12,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          effects: [
            {
              on: 'hover',
              style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default LineChart;
