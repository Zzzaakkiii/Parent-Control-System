import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
// components
import FileUpload from '../components/FileUpload';

import Table from './Table';
import Page from '../components/Page';
import User from './User';

// ----------------------------------------------------------------------

// const _role = localStorage.getItem("role");
// const _token = localStorage.getItem("token");

export default function DashboardApp() {
  const [role, setRole] = useState(localStorage.getItem("role"))
  const [token, setToken] = useState(localStorage.getItem("token"))

  useEffect(() => {
    setRole(localStorage.getItem('role'));
    setToken(localStorage.getItem('token'))
  }, [role, token]);

  return (
    <Page title="Dashboard" style={{ backgroundColor: "#e8f9fd" }}>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }} style={{ textAlign: "center" }}>
          Hi, Welcome to PCS
        </Typography>
        {role === "admin" && <FileUpload />}
        {token && <Table token={token} />}
        {role === "admin" && <User token={token} />}
      </Container>
    </Page>
  );
}
