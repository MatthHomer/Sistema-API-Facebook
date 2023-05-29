import React from "react";
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleFormSubmit = (values) => {
    const storedData = localStorage.getItem("formData");
    let existingData = [];
    if (storedData) {
      try {
        existingData = JSON.parse(storedData);
        if (!Array.isArray(existingData)) {
          existingData = [];
        }
      } catch (error) {
        console.error("Error parsing stored data:", error);
      }
    }
    const newData = [...existingData, values];
    const jsonData = JSON.stringify(newData);
    localStorage.setItem("formData", jsonData);
    console.log(values);
  };

  const phoneRegExp =
    /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/;

  const checkoutSchema = yup.object().shape({
    nome: yup.string().required("Obrigatório"),
    cargo: yup.string().required("Obrigatório"),
    email: yup.string().email("E-mail inválido").required("Obrigatório"),
    senha: yup.string().required("Obrigatório"),
    contato: yup
      .string()
      .matches(phoneRegExp, "Telefone inválido")
      .required("Obrigatório"),
  });

  const initialValues = {
    nome: "",
    cargo: "",
    email: "",
    senha: "",
    contato: "",
    isSubmitted: false,
  };

  return (
    <Box m="20px">
      <Header title="Criar Usuário" subtitle="Adicione novos usuários" />

      <Formik
        onSubmit={(values, { resetForm }) => {
          values.isSubmitted = true;
          handleFormSubmit(values);
          resetForm();
        }}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
          resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              {/* Campos do formulário */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Nome"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nome}
                name="nome"
                error={
                  !!touched.nome &&
                  (!!errors.nome || (values.isSubmitted && !!errors.nome))
                }
                helperText={
                  touched.nome &&
                  (errors.nome || (values.isSubmitted && errors.nome))
                }
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Cargo"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.cargo}
                name="cargo"
                error={
                  !!touched.cargo &&
                  (!!errors.cargo || (values.isSubmitted && !!errors.cargo))
                }
                helperText={
                  touched.cargo &&
                  (errors.cargo || (values.isSubmitted && errors.cargo))
                }
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="email"
                label="E-mail"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={
                  !!touched.email &&
                  (!!errors.email || (values.isSubmitted && !!errors.email))
                }
                helperText={
                  touched.email &&
                  (errors.email || (values.isSubmitted && errors.email))
                }
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Senha"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.senha}
                name="senha"
                error={
                  !!touched.senha &&
                  (!!errors.senha || (values.isSubmitted && !!errors.senha))
                }
                helperText={
                  touched.senha &&
                  (errors.senha || (values.isSubmitted && errors.senha))
                }
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Contato"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contato}
                name="contato"
                error={
                  !!touched.contato &&
                  (!!errors.contato || (values.isSubmitted && !!errors.contato))
                }
                helperText={
                  touched.contato &&
                  (errors.contato || (values.isSubmitted && errors.contato))
                }
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box mt="20px">
              <Button type="submit" variant="contained" color="primary">
                Enviar
              </Button>
              <Button
                type="button"
                variant="outlined"
                color="secondary"
                ml="10px"
                onClick={() => resetForm()}
              >
                Limpar
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default Form;
