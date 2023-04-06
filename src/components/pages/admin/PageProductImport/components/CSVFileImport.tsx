import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import axios, { AxiosError } from 'axios';

type CSVFileImportProps = {
  url: string;
  title: string;
  resetError: () => void;
  onAuthError: (statusCode: number, message: string) => void;
};

export default function CSVFileImport({
  url,
  title,
  resetError,
  onAuthError,
}: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    try {
      resetError();
      console.log('uploadFile to', url);
      if (!file) return;
      // Get the presigned URL
      const authToken = localStorage.getItem('authorization_token');
      const response = await axios({
        method: 'GET',
        url,
        params: {
          name: encodeURIComponent(file.name),
        },
        headers: {
          ...(authToken && { Authorization: `Basic ${authToken}` }),
        },
      });
      console.log('File to upload: ', file.name);
      console.log('Uploading to: ', response.data);
      const result = await fetch(response.data, {
        method: 'PUT',
        body: file,
      });
      console.log('Result: ', result);
      setFile(undefined);
    } catch (error) {
      if (error instanceof AxiosError) {
        const response = error.response;
        if (response) onAuthError(response.status, response.data.message);
      } else {
        console.log(error);
      }
    }
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
