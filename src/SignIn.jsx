import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Box, Button, Container, styled, TextField, Typography} from '@mui/material';
import {useAuthState} from 'react-firebase-hooks/auth';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from './firebase.js';

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
`;

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (user) navigate('/home');
  }, [user, loading]);

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password).catch((error) => {
      console.log(error);
    });
  };

  return (
    <Base>
      <AuthBox display="flex" flexDirection="column">
        <Title variant="h4" component="h1">Авторизация</Title>
        <Field type="text" name="login"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               label="Почта или логин" size="small"/>
        <Field type="password" name="password" label="Пароль"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               size="small"/>
        <Login color="primary" variant="contained" size="large"
               onClick={handleSignIn}>Войти</Login>
      </AuthBox>
    </Base>
  );
};

export default SignIn;