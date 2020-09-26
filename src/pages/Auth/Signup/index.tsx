/* import * as React from 'react'; */
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers';
import {
  Button,
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

const SignUp: React.FC = () => {
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
        console.log(data);
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
    <>
      <PublicHeader />

      <Container component="main" fixed>
        <h3>Novo Cadastro</h3>

        <p>
          Lembre-se de fornecer um e-mail válidos, ele será sua chave de
          entrada.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            error={!!errors.name}
            helperText={errors.name?.message}
            name="name"
            variant="outlined"
            label="Nome"
            inputRef={register}
            fullWidth
            autoFocus
          />
          <TextField
            error={!!errors.email}
            helperText={errors.email?.message}
            name="email"
            variant="outlined"
            fullWidth
            id="email"
            label="Email"
            inputRef={register}
          />
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
          />
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
          />

          <Button type="submit" variant="contained">
            Confirmar cadastro
          </Button>
        </form>

        <Link href="/signin">Voltar para login</Link>
      </Container>

      <PublicFooter />
    </>
  );
};

export default SignUp;
