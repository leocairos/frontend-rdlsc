import React, { useCallback } from 'react';
import {
  Button,
  CssBaseline,
  TextField,
  Grid,
  makeStyles,
  Container,
  Link,
} from '@material-ui/core';

import Typography from '@material-ui/core/Typography';

import { useHistory } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers';

import logoImg from '../../../assets/logo.svg';

import { useAuth } from '../../../hooks/auth';
import { useToast } from '../../../hooks/toast';

const drawerWidth = 0;

interface ISignInFormData {
  email: string;
  password: string;
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
    '&:hover': {
      backgroundColor: '#183f73',
    },
  },
  content: {
    padding: theme.spacing(7),
  },
  logoHeader: {
    margin: theme.spacing(0.5),
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
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <img className={classes.logo} width={200} src={logoImg} alt="Logo" />

          <Typography component="h1" variant="h3">
            Login
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
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password?.message}
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
              Entrar
            </Button>
          </form>
          <Grid container>
            <Grid item xs>
              <Link href="/forgot-password">Esqueci minha senha</Link>
            </Grid>
            <Grid item>
              <Link href="/signup">Criar conta</Link>
            </Grid>
          </Grid>
        </div>
      </Container>
    </>
  );
};

export default SignIn;
