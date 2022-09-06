import { useEffect } from 'react';

const useKeyListener = (key: string, callback: () => void) => {
  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (event.key === key) {
        event.preventDefault();
        callback();
      }
    };
    document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [callback, key]);
};

export default useKeyListener;
