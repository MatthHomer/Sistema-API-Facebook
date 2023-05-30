import React, { useState, useEffect, Text,} from 'react';
import { Box, Button, IconButton, Typography, useTheme, Select, MenuItem} from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AssuredWorkload from "@mui/icons-material/AssuredWorkload";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import Progress from "../../components/Progress";
import { AccountBalance } from "@mui/icons-material";
import PieChart from '../../components/PieChart';

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedAPI, setSelectedAPI] = useState(null);
  const [totalSpend, setTotalSpend] = useState(0);
  const [apiOptions, setApiOptions] = useState([]);

  useEffect(() => {
    const apis = JSON.parse(localStorage.getItem('apis')) || [];
    setApiOptions(apis);
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedAPI]);

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

        const totalSpendValue = transformedData.reduce((sum, item) => sum + item.clicks, 0);
        setTotalSpend(totalSpendValue);
      } else {
        console.error('Error: Invalid data format or empty data array');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAPIChange = (event) => {
    setSelectedAPI(event.target.value);
  };

  return (

    <Box m="20px" marginTop={-0.2}>
      <Box
        display="grid"
        gridTemplateColumns="repeat(8, 1fr)"
        paddingBottom={2.5}
        gridAutoRows="100px"
        gap="20px"
      >
        <Box 
          fontSize={13}
          gridColumn="span 2"
          backgroundColor={colors.primary[400]}
          display="flex"
          borderRadius={2}
          boxShadow={10}
          alignItems="center"
          justifyContent="center"
          > 
        <Typography variant="h5" fontWeight="600" color={colors.grey[100]} paddingRight={5}> Selecione sua API: </Typography>
          <Select value={selectedAPI ? selectedAPI : ''} onChange={handleAPIChange}>
            {!selectedAPI && (
              <MenuItem value={''}></MenuItem>
            )}
            {apiOptions.map((api, index) => (
              <MenuItem key={index} value={api}>
                {api.apiName}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      {/* GRID & CHARTS */}

      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          borderRadius={2}
          boxShadow={10}
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${totalSpend.toFixed(0)}`} // Altere o título para mostrar o totalSpend
            subtitle="Valor Revertido "
            progress="0.75"
            increase="+14%"
            icon={
              <AssuredWorkload
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          borderRadius={2}
          boxShadow={10}
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${totalSpend.toFixed(0)}`} // Altere o título para mostrar o totalSpend
            subtitle="E-mails Enviados"
            progress="0.75"
            increase="+14%"
            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          borderRadius={2}
          boxShadow={10}
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${totalSpend.toFixed(0)}`} // Altere o título para mostrar o totalSpend
            subtitle="Vendas Obtidas"
            progress="0.50"
            increase="+21%"
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          borderRadius={2}
          boxShadow={10}
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={`${totalSpend.toFixed(0)}`} // Altere o título para mostrar o totalSpend
            subtitle="Novos Clientes"
            progress="0.30"
            increase="+5%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box gridColumn="span 6" gridRow="span 2" borderRadius={2} boxShadow={10} backgroundColor={colors.primary[400]}>
          <Box mt="10px" p="0 20px" display="flex " justifyContent="space-between" alignItems="center">

            <Box>
              <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
                Receita Total de Spend
              </Typography>
              <Typography variant="h3" fontWeight="bold" color={colors.greenAccent[500]}>
                {`R$${totalSpend.toFixed(2)}`} {/* Exibir a soma total de spend */}
              </Typography>
            </Box>

            <Box>
              <IconButton>
                <DownloadOutlinedIcon sx={{ fontSize: "26px", color: colors.greenAccent[500] }} />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} selectedAPI={selectedAPI}/>
          </Box>
        </Box>

        <Box
          display="flex"
          borderRadius={2}
          boxShadow={10}
          justifyContent="center"
          alignItems="center"
          gridColumn="span 3"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            alignItems="center"
            display='column'
            flexDirection='row'
            paddingTop={3.5}
            paddingRight={2}
          >
            <Typography
              alignItems="center"
              alignContent="center"
              justifyContent="center"
              variant="h5"
              fontWeight="600"
              position="absolute"
              paddingLeft={8.5}
              paddingTop={1.5}
            >
              Taxa de Visualização de Vídeos
            </Typography>

            <Box>
              <img
                alt="2555"
                width={470}
                height={330}
                src={`../../assets/2555.png`}
              />
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            marginLeft={42}
            position="absolute"
            paddingRight={1}>
            <Typography paddingTop={1.3} variant="h7" fontWeight="600">25%</Typography>
            <Typography paddingTop={4.5} variant="h7" fontWeight="600">50%</Typography>
            <Typography paddingTop={4.5} variant="h7" fontWeight="600">75%</Typography>
            <Typography paddingTop={4.3} variant="h7" fontWeight="600">100%</Typography>
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            marginLeft={42}
            position="absolute"
            paddingTop={5}
            paddingRight={46}
            color={colors.primary[500]}
          >
            <Typography paddingTop={1.0} variant="h3" fontWeight="800">{`${totalSpend.toFixed(0)}`}</Typography>
            <Typography paddingTop={3.8} variant="h4" fontWeight="800">{`${totalSpend.toFixed(0)}`}</Typography>
            <Typography paddingTop={3.6} variant="h5" fontWeight="800">{`${totalSpend.toFixed(0)}`}</Typography>
            <Typography paddingTop={3.8} variant="h7" fontWeight="800">{`${totalSpend.toFixed(0)}`}</Typography>
          </Box>
        </Box>

        {/* Olhar a questão de largura dos valores para não ultrapassar o gráfico com valores altos */}

        {/* ROW 3 */}
        <Box
          gridColumn="span 3"
          gridRow="span 2"
          borderRadius={2}
          boxShadow={10}
          backgroundColor={colors.primary[400]}
          p="10px"
          paddingLeft={2}
        >

          <Typography
            variant="h5"
            fontWeight="600">
            Campanha
          </Typography>

          <Box height="200px" >
            <PieChart selectedAPI={selectedAPI}/>
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="flex-end"
          >

            <Typography variant="h4" fontWeight="bold" color={colors.greenAccent[500]}>
              {`R$${totalSpend.toFixed(2)} receita gerada`} {/* Exibir a soma total de spend */}
            </Typography>

            <Typography>Inclui despesas e custos extras diversos</Typography>
          </Box>

        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          borderRadius={2} boxShadow={10}
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.blueAccent[100]}
            p="15px"
          >
            <Typography color={colors.blueAccent[100]} variant="h5" fontWeight="600">
              Transações Recentes
            </Typography>
          </Box>
          {mockTransactions.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {transaction.txId}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {transaction.user}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{transaction.date}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                R${transaction.cost}
              </Box>
            </Box>
          ))}
        </Box>

        <Box
          gridColumn="span 8"
          gridRow="span 2"
          borderRadius={2}
          boxShadow={10}
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "20px 0 0 20px" }}
          >
            Quantidade de vendas
          </Typography>
          <Box height="280px" mt="-20px">
            <BarChart isDashboard={true} selectedAPI={selectedAPI}/>
          </Box>
        </Box>

      </Box>
    </Box >
  );
};

export default Dashboard;