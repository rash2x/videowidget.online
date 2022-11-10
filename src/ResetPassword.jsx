import React, {useContext, useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Box, Button, Container, styled, TextField, Typography} from '@mui/material';
import {useAuthState} from 'react-firebase-hooks/auth';
import {sendPasswordResetEmail} from 'firebase/auth';
import {auth} from './firebase.js';
import {useSnackbar} from 'notistack';
import {ProgressContext} from './ProgressContext.jsx';

const Base = styled(Container)`
  justify-content: center;
  align-items: center;
  display: flex;
  height: 100vh;
`;

const AuthBox = styled(Box)`
  max-width: 420px;
  min-width: 320px;
  padding: 16px;

  text-align: center;
`;

const Title = styled(Typography)`
  margin-bottom: 32px;
`;

const Field = styled(TextField)`
  margin-bottom: 16px;
`;

const Login = styled(Button)`
  margin-top: 16px;
  margin-bottom: 16px;
`;

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const {enqueueSnackbar} = useSnackbar();
  const {setProgress} = useContext(ProgressContext);
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  const handleReset = () => {
    setProgress(true);
    sendPasswordResetEmail(auth, email).then((result) => {
      enqueueSnackbar('Ссылка для восстановления пароля отправлена на почту', {variant: 'success'});
      navigate('/');
      setProgress(false);
    }).catch(error => {
      console.log(error);
    });
  };

  useEffect(() => {
    if (loading) {
      return;
    }

    if (user) navigate('/home');
  }, [user, loading]);

  return (
    <Base>
      <AuthBox display="flex" flexDirection="column">
        <Title variant="h4" component="h1">Восстановление пароля</Title>
        <Field type="text" name="login"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               label="Почта" size="small"/>
        <Login color="primary" variant="contained" size="large"
               onClick={handleReset}>Восстановить пароль</Login>
        <Button variant="text" to="/" component={Link}>Вернуться</Button>
      </AuthBox>

    </Base>
  );
};

export default ResetPassword;