import React, { useEffect, useState } from 'react';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Logout from '@material-ui/icons/ExitToApp';
import Stay from '@material-ui/icons/Home';
import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
    button: {
      alignItems: 'right',
      margin: '10px',
      fontSize: '.9em',
    },
    pFooter: {
      fontSize: '.8em',
    },
  }),
);

const myTimeOutPar = Number(process.env.REACT_APP_INACTIVE_TIMEOUT);
export const IdleTimeOutModal = ({
  showModal,
  handleClose,
  handleLogout,
}): any => {
  const classes = useStyles();
  const [idleTime, setIdleTime] = useState(myTimeOutPar);

  useEffect(() => {
    if (showModal && idleTime > 0) {
      setTimeout(() => setIdleTime(idleTime - 1), 1000);
    } else {
      setIdleTime(myTimeOutPar);
    }
  }, [idleTime, showModal]);

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={showModal}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={showModal}>
        <div className={classes.paper}>
          <h1>Alerta de inatividade!</h1>
          <p>Deseja permanecer conectado?</p>

          <Button
            variant="contained"
            onClick={handleLogout}
            startIcon={<Logout />}
            className={classes.button}
          >
            Logout
          </Button>
          <Button
            variant="contained"
            onClick={handleClose}
            startIcon={<Stay />}
            className={classes.button}
          >
            Permanecer
          </Button>
          <p className={classes.pFooter}>
            Desconexão automatica em {idleTime}s
          </p>
        </div>
      </Fade>
    </Modal>
  );
};
