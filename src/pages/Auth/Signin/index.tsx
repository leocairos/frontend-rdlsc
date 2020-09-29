import React, { useCallback } from 'react';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Container,
  Box,
  Grid,
  Link,
  Typography,
} from '@material-ui/core';

import { useHistory } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers';

import { useAuth } from '../../../hooks/auth';
import { useToast } from '../../../hooks/toast';
import useStyles from '../../../components/layout/useStyles';
import Copyright from '../../../components/layout/Copyright';

interface ISignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const classes = useStyles();

  const { signIn } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();

  const schema = yup.object().shape({
    email: yup
      .string()
      .required('E-mail obrigatório')
      .email('Digite um e-mail válido'),
  });

  const { register, handleSubmit, errors } = useForm<ISignInFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = useCallback(
    async (data: ISignInFormData) => {
      try {
        await signIn({
          email: data.email,
          password: data.password,
        });

        history.push('/');
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description: `${err.response.data.message}`,
        });
      }
    },
    [signIn, history, addToast],
  );

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Entrar
        </Typography>
        <form
          className={classes.form}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Entrar
          </Button>
        </form>
        <Grid container>
          <Grid item xs>
            <Link href="/forgot-password" variant="body2">
              Esqueci minha senha
            </Link>
          </Grid>
          <Grid item>
            <Link href="/signup" variant="body2">
              Criar conta
            </Link>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Copyright />
        </Box>
      </div>
    </Container>
  );
};

export default SignIn;
