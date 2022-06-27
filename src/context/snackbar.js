import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';

const StyledAlert = styled(MuiAlert)(({ theme }) => ({
  background: 'white',
  borderRadius: '2px',
  border: '1px solid black',
  fontFamily: 'Roboto',
  fontWeight: 700,
  color: '#222222',
  padding: '16px 24px',
}));

const SnackbarContext = React.createContext({});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <StyledAlert elevation={6} ref={ref} {...props} />;
});

const SnackbarProvider = ({ children }) => {
  const [snackbarInfo, setSnackbarInfo] = React.useState({ open: false });

  const handleClose = (_event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarInfo({ ...snackbarInfo, open: false });
  };

  const setSuccess = (message) => {
    setSnackbarInfo({ open: true, severity: 'success', message });
  };

  const setError = (message) => {
    setSnackbarInfo({ open: true, severity: 'error', message });
  };

  const setInfo = (message) => {
    setSnackbarInfo({ open: true, severity: 'info', message });
  };

  return (
    <SnackbarContext.Provider value={{ setSuccess, setError, setInfo }}>
      <Snackbar open={snackbarInfo.open} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={snackbarInfo.severity}>
          {snackbarInfo.message}
        </Alert>
      </Snackbar>
      {children}
    </SnackbarContext.Provider>
  );
};

const useSnackbar = () => React.useContext(SnackbarContext);

export { SnackbarProvider, useSnackbar };
