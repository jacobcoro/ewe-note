import { WindowClose } from '@styled-icons/fa-solid';
import { FC, ReactElement } from 'react';
import styles from './Dialog.module.scss';
import useKeyListener from './useKeyListener';

export interface DialogProps {
  children: ReactElement;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogInner = ({ open, setOpen, children }: DialogProps) => {
  // inside inner to only listen to the escape key if the dialog is open
  useKeyListener('Escape', () => setOpen(false));

  return (
    <dialog className={styles.root} open={open}>
      <button className={styles.closeButton} onClick={() => setOpen(false)}>
        <WindowClose size={18} />
      </button>
      {children}
    </dialog>
  );
};

export const Dialog: FC<DialogProps> = (props) => {
  const { open, setOpen } = props;

  if (!open) return null;

  return (
    <>
      <div className={styles.backdrop} onClick={() => setOpen(false)}></div>
      <DialogInner {...props} />
    </>
  );
};
