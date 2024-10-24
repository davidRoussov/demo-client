import { useState } from 'react'
import { FileUpload } from '@components';
import { css } from '@emotion/css';

function App() {
  const [ files, setFiles ] = useState<File[]>([]);

  const handleSubmitFiles = async (): Promise<void> => {
    throw new Error('Unimplemented');
  };

  return (
    <div>
      <form className={css`
        display: flex;
        flex-direction: column;
      `}>
        <FileUpload
          files={files}
          onChange={(newFiles: Files[]) => {
            setFiles(newFiles);
          }}
        />
        <button
          type="submit"
          onSubmit={(event: FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            handleSubmitFiles();
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default App
