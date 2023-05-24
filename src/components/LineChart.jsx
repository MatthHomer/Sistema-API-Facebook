import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material';
import { ResponsiveLine } from '@nivo/line';
import { tokens } from '../theme';

const LineChart = ({ isCustomLineColors = false, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://graph.facebook.com/v16.0/act_960375240984222/insights?time_increment=1&date_preset{last_year}&level=adset&fields=campaign_id,cpp,campaign_name,account_name,adset_name,impressions,spend,clicks,inline_link_clicks,website_ctr,reach&level=adset&breakdowns=country,region&limit=5000&access_token=EAAQ3iloCnogBAFLuT77GCB4K9LYNqZB5mCZCYf3qu1SQ4ABNn6pEaALB1JJTWY7wuXahZCNSamld2YWXuZCsVUi8cr7wynDiWUmY1dlZA5ZApHPO9XjCm5DeIX9heYz2qLe5z3V0xlF2mUuzqMFxgZC2GjHdnr62MxDjafmKgpLZAOmNxIx0YXHb'
        );

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

    fetchData();
  }, []);

  return (
    <ResponsiveLine
      data={[
        {
          id: 'Total Spend',
          color: 'blue',
          data: Array.isArray(data) ? data.map((item) => ({ x: item.date_start, y: item.spend })) : [],
        },
        {
          id: 'Total Clicks',
          color: 'red',
          data: Array.isArray(data) ? data.map((item) => ({ x: item.date_start, y: item.clicks })) : [],
        },
      ]}
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
        tooltip: {
          container: {
            color: colors.primary[500],
          },
        },
      }}
      colors={isDashboard ? { datum: 'color' } : { scheme: 'nivo' }}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
        stacked: false,
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
        legend: isDashboard ? undefined : 'transportation',
        legendOffset: 36,
        legendPosition: 'middle',
      }}
      axisLeft={{
        orient: 'left',
        tickValues: 5,
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : 'count',
        legendOffset: -40,
        legendPosition: 'middle',
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={8}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
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
          itemOpacity: 0.75,
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
