import React, { useCallback, useState } from 'react';

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
  LinearProgress,
  Container,
} from '@material-ui/core';

import { useHistory } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers';
import useStyles from '../../../components/layout/useStyles';
import Copyright from '../../../components/layout/Copyright';
import { api } from '../../../services/api';
import { useToast } from '../../../hooks/toast';

interface IForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const schema = yup.object().shape({
    email: yup
      .string()
      .required('E-mail obrigatório')
      .email('Digite um e-mail válido'),
  });

  const { register, handleSubmit, errors } = useForm<IForgotPasswordFormData>({
    resolver: yupResolver(schema),
  });

  const { addToast } = useToast();

  const onSubmit = useCallback(
    async (data: IForgotPasswordFormData) => {
      setLoading(true);
      try {
        await api.post('/password/forgot', { email: data.email });

        addToast({
          type: 'success',
          title: 'E-mail de recuperação de senha enviado',
          description:
            'Enviamos um e-mail para confirmar a recuperação de senha, verifique sua caixa de entrada.',
        });
        history.push('/');
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro na recuperação de senha',
          description: `${err.response.data.message}`,
        });
      }
      setLoading(false);
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
          Recuperar senha
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

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Recuperar senha
          </Button>
          {loading && <LinearProgress />}
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

export default ForgotPassword;
