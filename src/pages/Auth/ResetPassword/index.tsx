import React, { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { TextField } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers';

import logoImg from '../../../assets/logo.svg';

import { useToast } from '../../../hooks/toast';

import { Container, Content, AnimationContainer } from './styles';
import { api } from '../../../services/api';

interface IResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const ResetPassword: React.FC = () => {
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
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="" />

          <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Resetar senha</h1>

            <TextField
              error={!!errors.password}
              helperText={errors.password?.message}
              variant="outlined"
              name="password"
              label="Nova senha"
              type="password"
              inputRef={register}
            />

            <TextField
              error={!!errors.password_confirmation}
              helperText={errors.password_confirmation?.message}
              variant="outlined"
              name="password_confirmation"
              label="Confirmação da senha"
              type="password"
              inputRef={register}
            />

            <button type="submit">Alterar senha</button>
          </form>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default ResetPassword;
