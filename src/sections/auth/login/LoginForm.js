import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';

import api from '../../../Services/ParentControlService';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
    remember: true,
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    getValues,
  } = methods;

  const onSubmit = async () => {

    const res = await login(getValues());
    if (res) {
      console.log(res)
      setRole(res.role);
      setToken(res.token);
      navigate('/dashboard', { replace: true });
    }
  };

  const login = async (values) => {
    const request = {
      email: values.email,
      password: values.password
    };

    try {
      const response = await api.post("/auth/login", request);
      if (!response.ok) {
        throw new Error('Something went wrong');
      }
      return response;
    }
    catch (err) {
      setError(true);
      setErrorMessage(err.response.data.msg);
    }
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="email" label="Email address" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} />

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
        Login
      </LoadingButton>
      {error && <h4 style={{ color: "red", textAlign: "center", margin: "5px" }}>{errorMessage}</h4>}
    </FormProvider>
  );
}
