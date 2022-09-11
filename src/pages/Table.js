import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
    Stack,
    Typography,
    Button
} from '@mui/material';

import { Container } from '@mui/system';
import { saveAs } from "file-saver";

import api from '../Services/ParentControlService';

// const _token = localStorage.getItem("token");
let timer = 1000;

BasicTable.propTypes = {
    token: PropTypes.string,
};

export default function BasicTable({ token }) {
    const [files, setFiles] = useState([]);

    const changeTimer = () => {
        if (timer < 100000) timer *= 10;
    }

    useEffect(() => {
        const fetchFiles = async () => {
            const endpoint = localStorage.getItem("role") === "admin" ? "api/v1/get/admin/file" : "v1/get/file";
            const data = await api.get(endpoint, {
                headers: {
                    authorization: 'Bearer '.concat(localStorage.getItem("token")),
                },
            });
            setFiles(data.data.msg)
        }

        const interval = setInterval(() => {
            fetchFiles();
            changeTimer();
        }, timer);

        return () => {
            clearInterval(interval);
        };
    })

    const openInNewTab = (url, name) => {
        window.open(url, '_blank', 'noopener,noreferrer');
        logActivity("view", name);
    };

    const saveFile = (url, name) => {
        saveAs(
            url,
            name
        );

        logActivity("download", name);
    };

    const logActivity = async (action, name) => {
        const request = {
            activity: action,
            file_name: name
        };

        const data = await api.post("v1/notify", request, {
            headers: {
                authorization: 'Bearer '.concat(token),
            },
        });

        return data;
    }

    return (
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} mt={10}>
                <Typography variant="h4" gutterBottom>
                    Available Files
                </Typography>
            </Stack>
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>File</TableCell>
                        <TableCell align="right">View</TableCell>
                        <TableCell align="right">Download</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {files.map((row) => (
                        <TableRow
                            key={row._id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.file_name}
                            </TableCell>
                            <TableCell align="right">
                                <Button onClick={() => openInNewTab(row.url, row.file_name)}>
                                    View
                                </Button>
                            </TableCell>
                            <TableCell align="right">
                                <Button onClick={() => { saveFile(row.url, row.file_name) }}>
                                    Download
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        </Container>
    );
}
