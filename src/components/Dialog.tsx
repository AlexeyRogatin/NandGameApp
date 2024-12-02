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
            className="border-4 rounded-xl p-2 modal-content" overlayClassName="modal-overlay">
                <div className='flex flex-col gap-6'>
                    <div className='flex flex-col gap-6'>{children}</div>
                    <button className="border-4 rounded-xl p-2" onClick={onClose}>{buttonText}</button>
                </div>
        </Modal>
      );
}