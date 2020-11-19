import React, { useEffect, useState } from 'react';

import Logout from '@material-ui/icons/ExitToApp';
import Stay from '@material-ui/icons/Home';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
} from '@material-ui/core';

import Draggable from 'react-draggable';

const PaperComponent = props => {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
};

const myTimeOutPar = Number(process.env.REACT_APP_INACTIVE_TIMEOUT);
export const IdleTimeOutModal = ({
  showModal,
  handleClose,
  handleLogout,
}): any => {
  const [idleTime, setIdleTime] = useState(myTimeOutPar);

  useEffect(() => {
    if (showModal && idleTime > 0) {
      setTimeout(() => setIdleTime(idleTime - 1), 1000);
    } else {
      setIdleTime(myTimeOutPar);
    }
  }, [idleTime, showModal]);

  return (
    <div>
      <Dialog
        open={showModal}
        onClose={handleClose}
        PaperComponent={PaperComponent}
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          Alerta de inatividade!
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Deseja permanecer conectado? {idleTime}s
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogout} startIcon={<Logout />}>
            Logout
          </Button>
          <Button onClick={handleClose} startIcon={<Stay />}>
            Permanecer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
