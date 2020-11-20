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

import { api } from '../../services/api';
import { useToast } from '../../hooks/toast';

import useStyles from '../../components/layout/useStyles';
import Copyright from '../../components/layout/Copyright';

interface IMylimsSamplesDetailFormData {
  id: string;
  collection_point: string;
  sample_status: string;
}

const MylimsSamplesDetail: React.FC = () => {
  const classes = useStyles();
  const { addToast } = useToast();
  const history = useHistory();

  const schema = yup.object().shape({
    collectionPoint: yup.string().required('Ponto de coleta obrigatório'),
  });

  const { register, handleSubmit, errors } = useForm<
    IMylimsSamplesDetailFormData
  >({
    resolver: yupResolver(schema),
    defaultValues: {},
  });

  const onSubmit = useCallback(
    async (data: IMylimsSamplesDetailFormData) => {
      try {
        console.log(data);

        // history.push('/');
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
    [addToast],
  );

  return (
    <div className={classes.paper}>
      <Typography component="h1" variant="h5">
        Amostra
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
              id="id"
              label="id"
              name="id"
              autoFocus
              error={!!errors.id}
              helperText={errors.id?.message}
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
    </div>
  );
};

export default MylimsSamplesDetail;
