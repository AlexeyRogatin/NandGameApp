"use client"

import React from 'react';
import Modal from 'react-modal';

interface HintDialogProps {
  isOpen: boolean;
  text: string;
  buttonText: string;
  onClose: () => void;
}

export default function Dialog({ isOpen, text, buttonText, onClose }: HintDialogProps) {
    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Hint"
            className="bordered modal-content" overlayClassName="modal-overlay">
                <div className='flex flex-col gap-30'>
                    <div>{text}</div>
                    <button className="bordered" onClick={onClose}>{buttonText}</button>
                </div>
        </Modal>
      );
}