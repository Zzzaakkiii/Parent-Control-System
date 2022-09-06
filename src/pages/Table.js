import React, { useEffect, useState } from 'react';
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
import { saveAs } from "file-saver";

import api from '../Services/ParentControlService';

const _token = localStorage.getItem("token");
let timer = 1000;

export default function BasicTable() {
    const [files, setFiles] = useState([]);

    const changeTimer = () => {
        if (timer < 100000) timer *= 100;
    }

    useEffect(() => {
        const fetchFiles = async () => {
            const data = await api.get("v1/get/file", {
                headers: {
                    authorization: 'Bearer '.concat(_token),
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

    const openInNewTab = url => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const saveFile = (url, name) => {
        saveAs(
            url,
            name
        );
    };

    return (
        <TableContainer component={Paper}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} mt={10}>
                <Typography variant="h4" gutterBottom>
                    Available Files
                </Typography>
            </Stack>
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
                                <Button onClick={() => openInNewTab(row.url)}>
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
    );
}
