import { useEffect, useState } from 'react';
import { ResponsivePie } from "@nivo/pie";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";

const PieChart = () => {
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
            const campaignName = item.campaign_name;
            const impressions = Number(item.impressions);
            const clicks = Number(item.clicks);

            if (acc[campaignName]) {
              acc[campaignName].impressions += impressions;
              acc[campaignName].clicks += clicks;
            } else {
              acc[campaignName] = {
                impressions,
                clicks,
              };
            }

            return acc;
          }, {});

          const totalClicks = Object.values(modifiedData).reduce((acc, item) => acc + item.clicks, 0);

          const transformedData = Object.entries(modifiedData).map(([campaignName, { impressions, clicks }]) => {
            const percentage = (clicks / totalClicks) * 100;
            return {
              id: campaignName,
              value: clicks,
              percentage,
            };
          });

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
      <ResponsivePie
        data={data}
        theme={{
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.fontSize,
          textColor: theme.palette.text.primary,
        }}
        margin={{ top: 30, right: 120, bottom: 30, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}

        arcLinkLabel="value"
        arcLabel={data.percentage}
        enableRadialLabels={true}
        sliceLabel={({ percentage }) => {percentage.toFixed(2)}}
        /* sliceLabel={({ value, percentage }) => `R${value} clicks\n(${percentage.toFixed(2)}%)`} */

        legends={[
          {
            anchor: "right",
            direction: "column",
            justify: false,
            translateX: 200,
            translateY: 0,
            itemsSpacing: 0,
            itemWidth: 180,
            itemHeight: 18,
            itemTextColor: theme.palette.text.primary,
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 12,
            symbolShape: "circle",
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: theme.palette.text.primary,
                },
              },
            ],
          },
        ]}
      />
  );
};

export default PieChart;
