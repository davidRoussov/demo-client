import { useState, useEffect } from 'react'
import { css } from '@emotion/css';

import { FileUpload, ValueMapping } from '@components';
import { getFileFirstMb, getFirstRowExcel, getFirstRowCsv } from '@utilities';
import { DataType, TypeMapping } from '@types';

const appStyle = css`
  padding: 16px; /* default padding for small screens */

  @media (min-width: 576px) {
    padding: 24px; /* padding for small to medium screens */
  }

  @media (min-width: 768px) {
    padding: 32px; /* padding for medium screens */
  }

  @media (min-width: 992px) {
    padding: 40px; /* padding for large screens */
  }

  @media (min-width: 1200px) {
    padding: 48px; /* padding for extra large screens */
  }

  h2 {
    margin-bottom: 5px;
  }
`;

function App() {
  const [ file, setFile ] = useState<File | undefined>(undefined);
  const [ loading, setLoading ] = useState(false);
  const [ dataTypes, setDataTypes ] = useState<DataType[]>([]);
  const [ typeMappings, setTypeMappings ] = useState<TypeMapping[]>([]);
  const [ inferredTypeMappings, setInferredTypeMappings ] = useState<TypeMapping[]>([]);

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
      const response = await fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/type-detector/types/`);

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
    formData.append('mappings', JSON.stringify(typeMappings));

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/type-detector/inferences/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      console.info('Upload successful');

      const json = await response.json();

      console.info(json.message);

      setInferredTypeMappings(Object.entries(json.types));
    } catch(error) {
      console.error('Upload failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={appStyle}>
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
          <p>
            Leave field type unselected for it to be automatically inferred
          </p>
          <ValueMapping
            values={typeMappings}
            options={dataTypes}
            onChange={(newTypeMappings: TypeMapping[]) => setTypeMappings(newTypeMappings)}
          />
          <h2>Step 3: Infer types</h2>
          <p>
            Submit file for processing. Any types selected in the previous step will override the type converter.
          </p>
          {inferredTypeMappings.length > 0 ?
            <div>
              <h3>Results:</h3>
              <table className={css`margin-bottom: 20px;`}>
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {inferredTypeMappings.map(([column, dataType]: TypeMapping, index: number) => (
                    <tr key={index}>
                      <td>{column}</td>
                      <td>{dataType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div> : null
          }
          <div className={css`
            display: flex;
            justify-content: left;
          `}>
            <button
              type="submit"
              className={css`
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
