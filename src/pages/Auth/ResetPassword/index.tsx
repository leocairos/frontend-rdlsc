import React, { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Container,
  Box,
  Grid,
  Typography,
} from '@material-ui/core';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers';
import useStyles from '../../../components/layout/useStyles';
import Copyright from '../../../components/layout/Copyright';

import { useToast } from '../../../hooks/toast';

import { api } from '../../../services/api';

interface IResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
  const classes = useStyles();
  const { addToast } = useToast();
  const history = useHistory();
  const location = useLocation();

  const schema = yup.object().shape({
    password: yup.string().required('Senha obrigatória'),
  });

  const { register, handleSubmit, errors } = useForm<IResetPasswordFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = useCallback(
    async (data: IResetPasswordFormData) => {
      try {
        const { password, password_confirmation } = data;
        const token = location.search.replace('?token=', '');

        if (!token) {
          throw new Error();
        }

        await api.post('/password/reset', {
          password,
          password_confirmation,
          token,
        });

        addToast({
          type: 'success',
          title: 'Senha alterada',
        });
        history.push('/');
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro ao resetar senha',
          description: `${err.response.data.message}`,
        });
      }
    },
    [addToast, history, location.search],
  );

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Resetar senha
        </Typography>
        <form
          className={classes.form}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <Grid container spacing={2}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Nova senha"
              type="password"
              id="password"
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              inputRef={register}
            />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password_confirmation"
              label="Confirmação da senha"
              type="password"
              id="password_confirmation"
              error={!!errors.password_confirmation}
              helperText={errors.password_confirmation?.message}
              inputRef={register}
            />
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Alterar senha
          </Button>
        </form>

        <Box mt={5}>
          <Copyright />
        </Box>
      </div>
    </Container>
  );
};

export default ResetPassword;
