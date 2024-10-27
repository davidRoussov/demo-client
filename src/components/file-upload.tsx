import React, { useCallback } from 'react';
import { css } from '@emotion/css';
import { useDropzone, DropzoneOptions } from 'react-dropzone';

export const FileUpload = ({
  files,
  onChange,
}: {
  files: File[];
  onChange: (files: File[]) => void;
}) => {
  const onDrop = useCallback<DropzoneOptions['onDrop']>((acceptedFiles) => {
    onChange(acceptedFiles);
  }, [files, onChange]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={css`
          border: 1px solid black;
          border-radius: 2px;
          text-align: center;
          cursor: pointer;
          color: ${isDragActive ? 'blue' : 'black'};
          padding: 50px 25px;
        `}
      >
        <input {...getInputProps()} accept=".csv,.xls,.xlsx"/>
        {
          isDragActive ?
          <p>Drop the file here...</p> :
          <p>Drag and drop files here, or click to select a file</p>
        }
      </div>
      {files.length > 0 && (
        <div className={css`color: black; margin-top: 10px;`}>
          <p>File(s) to be uploaded:</p>
          <ul className={css`padding: 0px;`}>
            {files.map((file) => (
              <li key={file.name}>
                {file.name} - {file.size} bytes
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
