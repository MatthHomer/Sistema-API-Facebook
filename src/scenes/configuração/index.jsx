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
    apiLink: "",
    apiName: "",
    apiColab: "",
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
      apiLink: values.apiLink,
      apiName: values.apiName,
      apiDate: values.apiDate,
      apiColab: values.apiColab,
    };

    const updatedApis = [...apis, newApi];

    localStorage.setItem('apis', JSON.stringify(updatedApis));

    setApis(updatedApis);
    resetForm(); // Limpa o formulário

    setFormValues({
      companyName: "",
      apiDate: "",
      apiLink: "",
      apiName: "",
      apiColab: "",
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
  ];

  return (
    <Box m="20px" fontSize={15}>
      <Header title="Registrar Chave API" subtitle="Registrar Nova Chave API" />

      <Formik
        onSubmit={handleSubmit}
        initialValues={formValues}
        validationSchema={checkoutSchema}
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
                type="link"
                label="Link da API"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.apiLink}
                name="apiLink"
                sx={{ gridColumn: "span 4" }}
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

const checkoutSchema = yup.object().shape({
  companyName: yup.string().required("required"),
  apiName: yup.string().required("required"),
  apiDate: yup.string().required("required"),
  apiLink: yup.string().required("required"),
});

export default FormPage;
