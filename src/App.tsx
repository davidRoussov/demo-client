import { useState } from 'react'
import { FileUpload } from '@components';
import { css } from '@emotion/css';

function App() {
  const [ files, setFiles ] = useState<File[]>([]);
  const [ loading, setLoading ] = useState(false);

  const handleSubmitFiles = async (): Promise<void> => {
    if (files.length > 0) {
      setLoading(true);

      const firstFile = files[0];

      let formData = new FormData();
      formData.append('file', firstFile);

      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_BASE_URL}/upload`, {
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
