/* import * as React from 'react'; */
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers';
import {
  Button,
  CssBaseline,
  TextField,
  Grid,
  Container,
  makeStyles,
  Link,
} from '@material-ui/core';

import {
  PublicFooter,
  PublicHeader,
} from '../../../components/layout/PublicHeaderFooter';

import { api } from '../../../services/api';
import { useToast } from '../../../hooks/toast';

const drawerWidth = 0;

interface ISignUpFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    backgroundColor: '#3483CB',
    width: '35%',
    height: '50px',
    fontSize: '16px',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#183f73',
    },
  },
  alignmentButtonSubmit: {
    textAlign: 'right',
  },
  submitDependent: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: '#183f73',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 'normal',
    '&:hover': {
      backgroundColor: '#3483CB',
    },
  },
  buttonDelDependent: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: '#183f73',
    width: '50%',
  },
  field: {
    backgroundColor: '#FFFAFA',
  },
  title: {
    margin: theme.spacing(1, 0),
    fontSize: '16px',
  },
  titleDependent: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(1),
    fontSize: '16px',
  },
  group: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2),
    border: '1px solid',
    borderColor: '#DCDCDC',
    backgroundColor: '#fafafa',
  },
  content: {
    padding: theme.spacing(6),
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
}));

const SignUp: React.FC = () => {
  const { addToast } = useToast();
  const history = useHistory();

  const classes = useStyles();

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
        await api.post('users', data);

        history.push('/');
        addToast({
          type: 'success',
          title: 'Cadastro realizado',
        });
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: `${err.response.data.message}`,
        });
      }
    },
    [addToast, history],
  );

  return (
    <>
      <PublicHeader />

      <Container component="main" fixed className={classes.content}>
        <h3>Novo Cadastro</h3>

        <p>
          Lembre-se de fornecer um e-mail válidos, ele será sua chave de
          entrada.
        </p>

        <CssBaseline />
        <div className={classes.paper}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <TextField
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  name="name"
                  variant="outlined"
                  label="Nome"
                  inputRef={register}
                  fullWidth
                  autoFocus
                  className={classes.field}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  name="email"
                  variant="outlined"
                  fullWidth
                  id="email"
                  label="Email"
                  inputRef={register}
                  className={classes.field}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  name="password"
                  variant="outlined"
                  fullWidth
                  id="password"
                  label="Senha"
                  type="password"
                  inputRef={register}
                  className={classes.field}
                />
              </Grid>

              <Grid item xs={12} sm={3}>
                <TextField
                  error={!!errors.password_confirmation}
                  helperText={errors.password_confirmation?.message}
                  name="password_confirmation"
                  variant="outlined"
                  fullWidth
                  id="password_confirmation"
                  label="Confirmar senha"
                  type="password"
                  inputRef={register}
                  className={classes.field}
                />
              </Grid>
            </Grid>

            <Grid
              className={classes.alignmentButtonSubmit}
              item
              xs={12}
              sm={12}
            >
              <Button
                type="submit"
                variant="contained"
                className={classes.submit}
              >
                Confirmar cadastro
              </Button>
            </Grid>
          </form>

          <Grid container>
            <Grid item>
              <Link href="/signin">Voltar para login</Link>
            </Grid>
          </Grid>
        </div>
      </Container>

      <PublicFooter />
    </>
  );
};

export default SignUp;
