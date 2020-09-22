import React, { useCallback, useState } from 'react';

import {
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  makeStyles,
  Container,
  LinearProgress,
  Typography,
} from '@material-ui/core';

import { useHistory } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers';
import logoImg from '../../../assets/logo.svg';
import { api } from '../../../services/api';
import { useToast } from '../../../hooks/toast';

const drawerWidth = 0;

interface IForgotPasswordFormData {
  email: string;
}

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(5),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    color: '#fafafa',
    backgroundColor: '#3483CB',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      backgroundColor: '#183f73',
    },
  },
  field: {
    backgroundColor: '#FFFAFA',
  },
}));

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
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <img className={classes.logo} src={logoImg} alt="Logo" />

          <Typography component="h1" variant="h3">
            Recuperar senha
          </Typography>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className={classes.form}
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
              className={classes.field}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Recuperar
            </Button>
            {loading && <LinearProgress />}
          </form>
          <Grid container>
            <Grid item>
              <Link href="/signin">Voltar para login</Link>
            </Grid>
          </Grid>
        </div>
      </Container>
    </>
  );
};

export default ForgotPassword;
