import * as Yup from 'yup';
import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
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

export default function RegisterForm() {
  // const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    getValues
  } = methods;

  const onSubmit = async () => {
    const res = await signup(getValues());
    if (res) {
      setSuccess(true);
      setSuccessMessage(res.data.msg)
    } else {
      setSuccess(false);
      setSuccessMessage("");
    }
  }

  const signup = async (values) => {
    const request = {
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email,
      password: values.password
    };

    try {
      const response = await api.post("/auth/signup", request);
      setError(false);
      setErrorMessage("");
      setSuccess(false);
      setSuccessMessage("");
      return response;
    }
    catch (err) {
      setError(true);
      setErrorMessage(err.response.data.msg);
    }

    return 0;
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="firstName" label="First name" />
          <RHFTextField name="lastName" label="Last name" />
        </Stack>

        <RHFTextField name="email" label="Email address" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Register
        </LoadingButton>
      </Stack>
      {error && <h4 style={{ color: "red", textAlign: "center", margin: "5px" }}>{errorMessage}</h4>}
      {success && <h4 style={{ color: "green", textAlign: "center", margin: "5px" }}>{successMessage}</h4>}
    </FormProvider>
  );
}
