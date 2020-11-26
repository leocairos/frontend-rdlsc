import React, { Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers';

import {
  Button,
  TextField,
  Grid,
  Typography,
  IconButton,
} from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';

import useStyles from '../../components/layout/useStyles';

import { IDataSample } from './MylimsSampleTypes';

interface IMylimsSamplesDetailFormData {
  id: string;
  collection_point: string;
  sample_status: string;
}

interface IDataSampleForm {
  sample: IDataSample;
  action: string;
  setOpenDetail: Dispatch<SetStateAction<boolean>>;
}

const MylimsSamplesDetail: React.FC<IDataSampleForm> = ({
  sample,
  setOpenDetail,
  action,
}) => {
  const classes = useStyles();

  useEffect(() => {
    // console.log('sample', sample);
  }, []);

  const schema = yup.object().shape({
    collectionPoint: yup.string().required('Ponto de coleta obrigatório'),
  });

  const { register, handleSubmit, errors } = useForm<
    IMylimsSamplesDetailFormData
  >({
    resolver: yupResolver(schema),
    defaultValues: {},
  });

  const onSubmit = useCallback(async () => {}, []);

  return (
    <div className={classes.paperModal}>
      <Typography variant="h5" className={classes.paperTitle}>
        <IconButton aria-label="back" onClick={() => setOpenDetail(false)}>
          <ArrowBack onClick={() => setOpenDetail(false)} fontSize="inherit" />
        </IconButton>
        Amostra {sample?.id} -
        <span style={{ fontSize: 15, position: 'relative', top: -2 }}>
          {action}
        </span>
      </Typography>
      <form
        className={classes.form}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Grid container spacing={2}>
          <Grid item sm={3}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              required
              id="id"
              label="id"
              name="id"
              disabled
              value={sample?.id}
              error={!!errors.id}
              helperText={errors.id?.message}
              inputRef={register}
            />
          </Grid>
          <Grid item sm={9}>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              required
              id="collection_point"
              label="Ponto de Coleta"
              name="collection_point"
              disabled={action === 'view' || action === 'delete'}
              value={sample?.collection_point}
              error={!!errors.collection_point}
              helperText={errors.collection_point?.message}
              inputRef={register}
            />
          </Grid>
        </Grid>
        <Grid container spacing={10}>
          <Grid item>
            <Button type="submit" variant="contained">
              Confirmar
            </Button>
            <Button
              type="button"
              variant="contained"
              onClick={() => setOpenDetail(false)}
            >
              Cancelar
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default MylimsSamplesDetail;
