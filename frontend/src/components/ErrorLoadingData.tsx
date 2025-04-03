import { DatabaseBackupIcon } from 'lucide-react';

import { Button } from './ui/button';

interface Props {
  reset: () => void;
  error: Error;
}

export const ErrorLoadingData = ({ reset, error }: Props) => {
  return (
    <div className="text-muted-foreground mx-auto flex size-full max-w-[350px] flex-col items-center justify-center text-center">
      <h1 className="text-primary mb-3 text-3xl font-semibold">Oops!</h1>
      <p>Sorry, an unexpected error occurred while loading data from the server.</p>
      <p>Data not found!</p>
      {process.env.NODE_ENV === 'development' && <p>{error.message}</p>}
      <Button className="mt-3" onClick={reset} size={'icon'} variant={'outline'}>
        <DatabaseBackupIcon />
      </Button>
    </div>
  );
};
