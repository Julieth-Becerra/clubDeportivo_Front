import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const Modal = ({ visible, onHide, title, content, buttonName, buttonAction, severity }) => {
  return (
    <Dialog visible={visible} onHide={onHide} header={title} modal style={{ width: '350px', zIndex: '10' }}>
      <div>{content}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <div>
          <Button label="Cerrar"  className="p-button-secondary" onClick={onHide} />
        </div>
        {buttonName && buttonAction && (
          <div>
            <Button label={buttonName}  severity={severity}  onClick={buttonAction} />
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default Modal;
