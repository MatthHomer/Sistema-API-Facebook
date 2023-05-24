import { useEffect, useState } from 'react';
import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const Progress = ({ progress = "0.75", size = "40" }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const angle = progress * 360;

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
              campaignName,
              impressions,
              clicks,
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
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          background: `radial-gradient(${colors.primary[400]} 55%, transparent 56%),
            conic-gradient(transparent 0deg ${angle}deg, ${colors.blueAccent[500]} ${angle}deg 360deg),
            ${colors.greenAccent[500]}`,
          borderRadius: "50%",
          width: `${size}px`,
          height: `${size}px`,
          marginRight: "10px",
        }}
      />
      <Box>
        {data.map(({ campaignName, clicks, percentage }) => (
          <div key={campaignName}>
            <span>{campaignName}: </span>
            <span>{clicks} clicks</span>
            <span> ({percentage.toFixed(2)}%)</span>
          </div>
        ))}
      </Box>
    </Box>
  );
};

export default Progress;
