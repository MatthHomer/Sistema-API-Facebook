import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Button, TextField } from "@mui/material";
import Header from "../../components/Header";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";

const FormPage = () => {
  const [apis, setApis] = useState([]);
  const [formValues, setFormValues] = useState({
    companyName: "",
    apiDate: "",
    apiName: "",
    apiColab: "",
    actValue: "",
    tokenValue: "",
  });

  const isNonMobile = useMediaQuery("(min-width:600px)");

  useEffect(() => {
    const storedApis = JSON.parse(localStorage.getItem('apis')) || [];
    setApis(storedApis);
  }, []);

  const handleSubmit = (values, { resetForm }) => {
    const newApi = {
      id: Date.now(),
      companyName: values.companyName,
      apiLink: generateApiLink(values.actValue, values.tokenValue),
      apiName: values.apiName,
      apiDate: values.apiDate,
      apiColab: values.apiColab,
      isDefault: false, // Adicionado o valor padrão para isDefault
    };

    const updatedApis = [...apis, newApi];

    localStorage.setItem('apis', JSON.stringify(updatedApis));

    setApis(updatedApis);
    resetForm(); // Limpa o formulário

    setFormValues({
      companyName: "",
      apiDate: "",
      apiName: "",
      apiColab: "",
      actValue: "",
      tokenValue: "",
    });
  };

  const handleDelete = (id) => {
    const updatedApis = apis.filter((api) => api.id !== id);
    localStorage.setItem('apis', JSON.stringify(updatedApis));
    setApis(updatedApis);
  };

  const handleCellEditCommit = (params) => {
    const updatedApis = apis.map((api) => {
      if (api.id === params.id) {
        return { ...api, [params.field]: params.value };
      }
      return api;
    });

    localStorage.setItem('apis', JSON.stringify(updatedApis));
    setApis(updatedApis);
  };

  const generateApiLink = (actValue, tokenValue) => {
    return `https://graph.facebook.com/v17.0/act_${actValue}/insights?time_increment=1&date_preset{last_year}&level=adset&fields=campaign_id,cpp,campaign_name,account_name,adset_name,impressions,spend,clicks,inline_link_clicks,website_ctr,reach&level=adset&breakdowns=country,region&limit=5000&access_token=${tokenValue}`;
  };

  const handleSetDefaultAPI = (id) => {
    const updatedApis = apis.map((api) => {
      if (api.id === id) {
        return { ...api, isDefault: true };
      }
      return { ...api, isDefault: false };
    });

    localStorage.setItem('apis', JSON.stringify(updatedApis));
    setApis(updatedApis);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'companyName', headerName: 'Nome da empresa', width: 200, editable: true },
    { field: 'apiName', headerName: 'Nome da API', width: 200, editable: true },
    { field: 'apiLink', headerName: 'Link da API', width: 200, editable: true },
    { field: 'apiDate', headerName: 'Data de Registro', width: 200, editable: true },
    { field: 'apiColab', headerName: 'Colaborador Responsável', width: 200, editable: true },
    {
      field: 'delete',
      headerName: 'Excluir',
      width: 100,
      renderCell: (params) => (
        <Button variant="contained" color="error" onClick={() => handleDelete(params.row.id)}>
          Excluir
        </Button>
      ),
    },
    {
      field: 'setDefault',
      headerName: 'API Padrão',
      width: 150,
      renderCell: (params) => (
        <Button
          variant={params.row.isDefault ? 'contained' : 'outlined'}
          onClick={() => handleSetDefaultAPI(params.row.id)}
        >
          Padrão
        </Button>
      ),
    },
  ];

  return (
    <Box m="20px" fontSize={15}>
      <Header title="Registrar Chave API" subtitle="Registrar Nova Chave API" />

      <Formik
        onSubmit={handleSubmit}
        initialValues={formValues}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          resetForm, // Adicionado para limpar o formulário manualmente
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(5, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Nome da Empresa"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.companyName}
                name="companyName"
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="date"
                label="Data de Registro"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.apiDate}
                name="apiDate"
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Nome da API"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.apiName}
                name="apiName"
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Colaborador Responsável"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.apiColab}
                name="apiColab"
                sx={{ gridColumn: "span 1" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Número da ID"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.actValue}
                name="actValue"
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Token"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.tokenValue}
                name="tokenValue"
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Salvar API
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      {apis.length > 0 && (
        <div style={{ height: 400, width: '100%', marginTop: '20px' }}>
          <DataGrid
            rows={apis}
            columns={columns}
            components={{
              Toolbar: () => (
                <GridToolbar />
              ),
            }}
            onCellEditCommit={handleCellEditCommit}
          />
        </div>
      )}
    </Box>
  );
};

export default FormPage;
