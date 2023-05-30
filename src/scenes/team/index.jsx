import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Nome",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "senha",
      headerName: "Senha",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "phone",
      headerName: "Contato",
      flex: 1,
    },
    {
      field: "accessLevel",
      headerName: "Cargo",
      flex: 1,
      renderCell: ({ row }) => {
        const { accessLevel } = row;
        let cargoIcon, cargoColor;

        switch (accessLevel) {
          case "Admin":
            cargoIcon = <AdminPanelSettingsOutlinedIcon />;
            cargoColor = colors.greenAccent[600];
            break;
          case "Gerente":
            cargoIcon = <SecurityOutlinedIcon />;
            cargoColor = colors.greenAccent[700];
            break;
          case "Usuário":
            cargoIcon = <LockOpenOutlinedIcon />;
            cargoColor = colors.greenAccent[700];
            break;
          default:
            cargoIcon = null;
            cargoColor = colors.greenAccent[700];
            break;
        }

        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={cargoColor}
            borderRadius="4px"
          >
            {cargoIcon}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {accessLevel}
            </Typography>
          </Box>
        );
      },
    },
  ];

  const [formData, setFormData] = useState([]);

  useEffect(() => {
    const storedData = localStorage.getItem("formData");
    const parsedData = storedData ? JSON.parse(storedData) : [];
    setFormData(parsedData);
  }, []);

  const mappedData = formData.map((data, index) => ({
    id: index + 1,
    name: data.nome,
    senha: data.senha,
    phone: data.contato,
    email: data.email,
    accessLevel: data.cargo,
  }));

  return (
    <Box m="20px">
      <Header title="Time" subtitle="Gerenciamento de Mebros do Time" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[700],
            fontWeight: "bold",
            "&:hover": {
              cursor: "pointer",
              color: colors.greenAccent[400],
            },
          },
        }}
      >
        <DataGrid
          rows={mappedData}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
};

export default Team;
