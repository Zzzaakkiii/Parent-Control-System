import * as React from "react";
import uuid from 'react-uuid';
import { Dropzone, FileItem } from "@dropzone-ui/react";

import api from '../Services/ParentControlService';

// const _token = localStorage.getItem("token");

const FileUpload = () => {
    const [files, setFiles] = React.useState([]);
    const updateFiles = (incommingFiles) => {
        setFiles(incommingFiles);
        const formData = new FormData();
        formData.append("file", incommingFiles[0].file);
        formData.append("name", incommingFiles[0].file.name);


        const uploadFile = async () => {
            try {
                const data = await api.post("v1/add/file", formData, {
                    headers: {
                        authorization: 'Bearer '.concat(localStorage.getItem("token")),
                    },
                });

                console.log(data);
                return data;
            }
            catch (err) {
                console.log(err);
            }
            return 0;
        }

        uploadFile();
    };
    return (
        <>
            <h2>Upload new file to system</h2>
            <Dropzone onChange={updateFiles} value={files} style={{ width: "40%", margin: "2em auto" }} >
                {files.map((file) => (
                    <FileItem {...file} preview key={uuid()} />
                ))}
            </Dropzone>
        </>
    );
}

export default FileUpload;