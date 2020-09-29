/* import * as React from 'react'; */
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Box,
  Grid,
  Link,
  Typography,
  Container,
} from '@material-ui/core';

import { api } from '../../../services/api';
import { useToast } from '../../../hooks/toast';

import useStyles from '../../../components/layout/useStyles';
import Copyright from '../../../components/layout/Copyright';

interface ISignUpFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const SignUp: React.FC = () => {
  const classes = useStyles();
  const { addToast } = useToast();
  const history = useHistory();

  const schema = yup.object().shape({
    name: yup.string().required('Nome obrigatório'),
    email: yup
      .string()
      .required('E-mail obrigatório')
      .email('Digite um e-mail válido'),
    password: yup.string().required('Senha obrigatória'),
  });

  const { register, handleSubmit, errors } = useForm<ISignUpFormData>({
    resolver: yupResolver(schema),
    defaultValues: {},
  });

  const onSubmit = useCallback(
    async (data: ISignUpFormData) => {
      try {
        // console.log(data);
        await api.post('users', data);

        history.push('/');
        addToast({
          type: 'success',
          title: 'Cadastro realizado',
        });
      } catch (err) {
        addToast({
          type: 'error',
          title: 'onSubmit: Erro no cadastro',
          description: `${err.response.data.message}`,
        });
      }
    },
    [addToast, history],
  );

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Cadastrar-se
        </Typography>
        <form
          className={classes.form}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="name"
                label="Nome"
                name="name"
                autoComplete="name"
                autoFocus
                error={!!errors.name}
                helperText={errors.name?.message}
                inputRef={register}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                error={!!errors.email}
                helperText={errors.email?.message}
                inputRef={register}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
                inputRef={register}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password_confirmation"
                label="Confirmar senha"
                type="password"
                id="password_confirmation"
                error={!!errors.password_confirmation}
                helperText={errors.password_confirmation?.message}
                inputRef={register}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Confirmar cadastro
          </Button>
        </form>
        <Grid container>
          <Grid item xs>
            <Link href="/signin">Voltar para login</Link>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Copyright />
        </Box>
      </div>
    </Container>
  );
};

export default SignUp;
