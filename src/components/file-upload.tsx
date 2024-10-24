import React, { useState, useCallback } from 'react';
import { css } from '@emotion/css';
import { useDropzone } from 'react-dropzone';

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
        <input {...getInputProps()} />
        {
          isDragActive ?
          <p>Drop the file here...</p> :
          <p>Drag and drop file here, or click to select file</p>
        }
      </div>
      {files.length > 0 && (
        <div className={css`color: black; margin-top: 10px;`}>
          <h4>Files to be uploaded:</h4>
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
