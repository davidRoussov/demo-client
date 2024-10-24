import { useState } from 'react'
import { FileUpload } from '@components';
import { css } from '@emotion/css';

function App() {
  const [ files, setFiles ] = useState<File[]>([]);
  const [ loading, setLoading ] = useState(false);

  const handleSubmitFiles = async (): Promise<void> => {
    setLoading(true);

    throw new Error('Unimplemented');
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
