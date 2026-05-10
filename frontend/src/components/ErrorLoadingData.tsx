import { useNavigate, useRouter } from '@tanstack/react-router';
import { DatabaseBackupIcon, HomeIcon } from 'lucide-react';

import { Button } from './ui/button';

interface Props {
  reset: () => void;
  error: Error;
}

export const ErrorLoadingData = ({ reset, error }: Props) => {
  const router = useRouter();
  const navigate = useNavigate();
  return (
    <div className="text-muted-foreground mx-auto flex size-full max-w-[350px] flex-col items-center justify-center text-center mt-10">
      <h1 className="text-foreground mb-3 text-3xl font-semibold">Oops!</h1>
      <p>Sorry, an unexpected error occurred while loading data from the server.</p>
      <p>Data not found!</p>
      {process.env.NODE_ENV === 'development' ? <p>{error.message}</p> : 'Something went wrong'}
      <div className="mt-3 flex gap-2">
        <Button onClick={() => navigate({ to: '/game' })} variant={'outline'}>
          <HomeIcon /> Home
        </Button>
        <Button onClick={() => router.invalidate()} variant={'outline'}>
          <DatabaseBackupIcon /> Reload
        </Button>
      </div>
    </div>
  );
};
