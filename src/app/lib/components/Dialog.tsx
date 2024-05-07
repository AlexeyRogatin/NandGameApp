"use client"

import React from 'react';
import Modal from 'react-modal';

interface HintDialogProps {
  isOpen: boolean;
  children: React.ReactNode;
  buttonText: string;
  onClose: () => void;
}

export default function Dialog({ isOpen, children, buttonText, onClose }: HintDialogProps) {
    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} ariaHideApp={false} contentLabel="Hint"
            className="bordered modal-content" overlayClassName="modal-overlay">
                <div className='flex flex-col gap-30'>
                    <div className='flex flex-col gap-10'>{children}</div>
                    <button className="bordered" onClick={onClose}>{buttonText}</button>
                </div>
        </Modal>
      );
}