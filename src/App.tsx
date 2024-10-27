import { useState, useEffect } from 'react'
import { FileUpload, ValueMapping } from '@components';
import { css } from '@emotion/css';

function App() {
  const [ files, setFiles ] = useState<File[]>([]);
  const [ loading, setLoading ] = useState(false);
  const [ dataTypes, setDataTypes ] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const dataTypes = await listDataTypes();
      setDataTypes(dataTypes);
    })();
  }, []);

  const listDataTypes = async (): Promise<string[]> => {
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
    if (files.length > 0) {
      setLoading(true);

      const firstFile = files[0];

      let formData = new FormData();
      formData.append('file', firstFile);

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
    }
  };

  console.log("dataTypes", dataTypes);

  return (
    <div className={css`padding: 100px 200px;`}>
      <h1>Welcome</h1>
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
          <FileUpload
            files={files}
            onChange={(newFiles: Files[]) => {
              setFiles(newFiles);
            }}
          />
          <div className={css`
            display: flex;
            justify-content: right;
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
