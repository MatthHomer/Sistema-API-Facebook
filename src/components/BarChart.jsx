import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';
import { tokens } from '../theme';

const BarChart = ({ isDashboard = false, selectedAPI }) => {
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
          const transformedData = json.data.map(item => ({
            date_start: item.date_start.substr(0, 10),
            impressions: Number(item.impressions),
            clicks: Number(item.clicks),
          }));

          setData(transformedData);
        } else {
          console.error('Error: Invalid data format or empty data array');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedAPI]);

  const formatXAxisTick = tickValue => {
    
    const date = new Date(tickValue);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
  
    return `${day} ${month}`;
  };

  return (
    <ResponsiveBar
      data={data}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],
            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      keys={['impressions', 'clicks']}
      indexBy="date_start"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.7}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={{ scheme: 'nivo' }}
      borderColor={{
        from: 'color',
        modifiers: [['darker', '1.6']],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 10,
        tickPadding: 5,
        tickRotation: 35,
        legend: isDashboard ? undefined : 'Date',
        legendPosition: 'middle',
        legendOffset: 32,
        format: formatXAxisTick
      }}
      axisLeft={{
        orient: 'left',
        tickSize: 5,
        tickValues: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : 'Count',
        legendOffset: -40,
        legendPosition: 'middle',
      }}
      enableLabel={true}
      enableGridY={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: 'color',
        modifiers: [['darker', 10.6]],
      }}
      legends={[
        {
          dataFrom: 'keys',
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: 'left-to-right',
          itemOpacity: 0.85,
          symbolSize: 20,
          effects: [
            {
              on: 'hover',
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      role="application"
      barAriaLabel={function (e) {
        return e.id + ': ' + e.formattedValue + ' in date: ' + e.indexValue;
      }}
      groupMode="grouped"
    />
  );
};

export default BarChart;
