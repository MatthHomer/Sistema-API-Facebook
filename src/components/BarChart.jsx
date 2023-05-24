import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material';
import { ResponsiveBar } from '@nivo/bar';
import { tokens } from '../theme';

const BarChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://graph.facebook.com/v16.0/act_575139636836823/insights?time_increment=1&date_preset{last_year}&level=adset&fields=campaign_id,campaign_name,account_name,adset_name,impressions,spend,clicks,inline_link_clicks,website_ctr,reach&level=adset&breakdowns=country,region&limit=5000&access_token=EAAICOnOwUhIBAH9WgRPnvtZCr6lqsbco1YzLZCsqLTW7JuyF3agYmLhYZBU2GEG1QcF6fytKJcv76aVZA1tIZAppqeVID6LCraGqttEo9E5sEDCejZAjJ8QT75RxehLHfHao1zZBdGzPb7bLlfpzXXNEr9kWneZBrXeZCLlELw3cvZBhFyKw1TfnZAT'
        );

        const json = await response.json();

        if (Array.isArray(json.data) && json.data.length > 0) {
          const modifiedData = json.data.reduce((acc, item) => {
            const dateStart = item.date_start.substr(0, 7);
            const impressions = Number(item.impressions);
            const clicks = Number(item.clicks);

            if (acc[dateStart]) {
              acc[dateStart].impressions += impressions;
              acc[dateStart].clicks += clicks;
            } else {
              acc[dateStart] = {
                impressions,
                clicks,
              };
            }

            return acc;
          }, {});

          const transformedData = Object.entries(modifiedData).map(([date, { impressions, clicks }]) => ({
            date_start: date,
            impressions,
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

    fetchData();
  }, []);

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
      defs={[
        {
          id: 'dots',
          type: 'patternDots',
          background: 'inherit',
          color: '#31bcb2',
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: 'lines',
          type: 'patternLines',
          background: 'inherit',
          color: '#eed312',
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      borderColor={{
        from: 'color',
        modifiers: [['darker', '1.6']],
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : 'Date', // changed
        legendPosition: 'middle',
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : 'Count', // changed
        legendPosition: 'middle',
        legendOffset: -40,
      }}
      enableLabel={true}
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
    />
  );
};

export default BarChart;
