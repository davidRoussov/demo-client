import { useState, useEffect } from 'react'

import { FileUpload, ValueMapping } from '@components';
import { css } from '@emotion/css';
import { getFileFirstMb, getFirstRowExcel, getFirstRowCsv } from '@utilities';
import { DataType, TypeMapping } from '@types';

function App() {
  const [ file, setFile ] = useState<File | undefined>(undefined);
  const [ loading, setLoading ] = useState(false);
  const [ dataTypes, setDataTypes ] = useState<DataType[]>([]);
  const [ typeMappings, setTypeMappings ] = useState<TypeMapping[]>([]);

  useEffect(() => {
    (async () => {
      const dataTypes = await listDataTypes();
      setDataTypes(dataTypes);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!file) {
        return;
      }

      const firstMb = await getFileFirstMb(file);
      const extension = file.name.split('.').pop()?.toLowerCase();

      if (extension === 'csv') {
        const firstRow = await getFirstRowCsv(firstMb);
        if (firstRow) {
          const newTypeMappings: TypeMapping[] = firstRow.map((column: string) => (
            [column, undefined]
          ));

          setTypeMappings(newTypeMappings);
        }
      } else if (['xls', 'xlsx'].includes(extension)) {
        const firstRow = await getFirstRowExcel(file);
        if (firstRow) {
          const newTypeMappings: TypeMapping[] = firstRow.map((column: string) => (
            [column, undefined]
          ));

          setTypeMappings(newTypeMappings);
        }
      }
    })();
  }, [file]);

  const listDataTypes = async (): Promise<DataType[]> => {
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/typeconverter/types/`);

      if (!response.ok) {
        throw new Error('Failed to list types');
      }

      return await response.json();
    } catch(error) {
      console.error('List types failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFiles = async (): Promise<void> => {
    setLoading(true);

    let formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/typeconverter/uploads/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      console.info('Upload successful');
    } catch(error) {
      console.error('Upload failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={css`padding: 100px 200px;`}>
      <h1>Welcome to type detector</h1>
      { loading ?
        <div>
          Loading...
        </div> :
        <form
          className={css`
            display: flex;
            flex-direction: column;
          `}
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            handleSubmitFiles();
          }}
        >
          <h2>Step 1: Select a CSV or Excel File</h2>
          <FileUpload
            files={file ? [ file ] : []}
            onChange={(newFiles: Files[]) => {
              if (newFiles.length > 0) {
                const firstFile = newFiles[0];
                setFile(firstFile);
              }
            }}
          />
          <h2>Step 2: Set types</h2>
          <ValueMapping
            values={typeMappings}
            options={dataTypes}
            onChange={(newTypeMappings: TypeMapping[]) => setTypeMappings(newTypeMappings)}
          />
          <h2>Step 3: Infer types</h2>
          <div className={css`
            display: flex;
            justify-content: left;
          `}>
            <button
              type="submit"
              className={css`
                margin-top: 10px;
                cursor: pointer;
              `}
            >
              Submit
            </button>
          </div>
        </form>
      }
    </div>
  );
}

export default App
