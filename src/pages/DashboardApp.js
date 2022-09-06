import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
// components
import FileUpload from '../components/FileUpload';

import Table from './Table';
import Page from '../components/Page';
import User from './User';

// ----------------------------------------------------------------------

const _role = localStorage.getItem("role");

export default function DashboardApp() {
  const [temp, setTemp] = useState()
  useEffect(() => {
    setTemp(_role);
    console.log(temp)
  }, [temp])

  return (
    <Page title="Dashboard" style={{ backgroundColor: "##e8f9fd" }}>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }} style={{ textAlign: "center" }}>
          Hi, Welcome to PCS
        </Typography>
        {_role === "admin" && <FileUpload />}
        <Table />
        {_role === "admin" && <User />}
      </Container>
    </Page>
  );
}
