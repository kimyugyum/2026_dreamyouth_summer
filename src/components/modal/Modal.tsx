import type { ReactNode } from 'react';

interface Props {
  show: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ show, onClose, children }: Props) {
  return (
    <div
      className={`overlay ${show ? 'show' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">{children}</div>
    </div>
  );
}
