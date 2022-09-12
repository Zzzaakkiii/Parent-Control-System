import React, { useState } from "react";
import uuid from 'react-uuid';
import { Dropzone, FileItem } from "@dropzone-ui/react";
import { Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

import api from '../Services/ParentControlService';

// const _token = localStorage.getItem("token");

const FileUpload = () => {
    const [files, setFiles] = useState([]);
    const [dept, setDepartment] = useState("Accounts");
    const [fileUploaded, setFileUploaded] = useState();

    const updateFiles = (incommingFiles) => {
        setFiles(incommingFiles);
        const formData = new FormData();
        formData.append("file", incommingFiles[0].file);
        formData.append("name", incommingFiles[0].file.name);
        formData.append("department", dept)

        const uploadFile = async () => {
            try {
                const data = await api.post("v1/add/file", formData, {
                    headers: {
                        authorization: 'Bearer '.concat(localStorage.getItem("token")),
                    },
                });

                setFileUploaded(true)
                setFiles([])
                return data;
            }
            catch (err) {
                console.log(err)
                setFileUploaded(false);
            }
            return 0;
        }

        uploadFile()
    };

    const handleDepartmentChange = e => {
        setDepartment(e.target.value)
        console.log(e.target.value)
    }

    return (
        <>
            <h2>Upload new file to system</h2>
            <InputLabel id="select-label" style={{ "width": "100%", "margin": "0 auto", "paddingTop": "10px", "display": "flex", "justifyContent": "center" }}>Select Department</InputLabel>
            <Box style={{ "width": "50%", "margin": "0 auto", "paddingTop": "10px", "display": "flex", "justifyContent": "center" }}>
                <FormControl fullWidth>
                    <Select
                        labelId="select-label"
                        id="simple-select"
                        value={dept}
                        onChange={handleDepartmentChange}
                        required
                    >
                        <MenuItem value="Accounts">Accounts</MenuItem>
                        <MenuItem value="Marketing">Marketing</MenuItem>
                        <MenuItem value="Sales">Sales</MenuItem>
                        <MenuItem value="Operations">Operations</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Dropzone onChange={updateFiles} value={files} style={{ width: "40%", margin: "2em auto" }} >
                {files.map((file) => (
                    <FileItem {...file} preview key={uuid()} />
                ))}
            </Dropzone>
            {fileUploaded && <div style={{ "color": "green", "width": "100%", "display": "flex", "justifyContent": "center" }}>File Uploaded Successfully!</div>}
        </>
    );
}

export default FileUpload;