import { useState, useEffect } from 'react';
// material
import {
  Card,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
} from '@mui/material';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import { UserListHead } from '../sections/@dashboard/user';

import api from '../Services/ParentControlService';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'fname', label: 'First Name', alignRight: false },
  { id: 'lname', label: 'Last Name', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false },
  { id: 'lastLogin', label: 'Last Login', alignRight: false },
  { id: '' }
];

const _token = localStorage.getItem("token");

// ----------------------------------------------------------------------

export default function User() {

  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchLatestLogins = async () => {
      const data = await api.get("v1/recent/user", {
        headers: {
          authorization: 'Bearer '.concat(_token),
        },
      });
      setUsers(data.data.msg)
    }

    fetchLatestLogins()
  }, [])

  return (
    <Page title="User">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} mt={10}>
          <Typography variant="h4" gutterBottom>
            Recent Login Activity
          </Typography>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  headLabel={TABLE_HEAD}
                />
                <TableBody>
                  {users.slice(10).map((row) => {
                    console.log(row)
                    const { fname, lname, email, role, lastLogin, id } = row;
                    console.log(row)
                    console.log(fname, lname, email, role, lastLogin, id)

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                      >
                        <TableCell align="left">{fname}</TableCell>
                        <TableCell align="left">{lname}</TableCell>
                        <TableCell align="left">{email}</TableCell>
                        <TableCell align="left">{role}</TableCell>
                        <TableCell align="left">{lastLogin}</TableCell>
                      </TableRow>
                    );
                  })}

                </TableBody>


              </Table>
            </TableContainer>
          </Scrollbar>
        </Card>
      </Container>
    </Page>
  );
}
