import React from 'react';
import { createPortal } from 'react-dom';

interface ModalPortalProps {
  children: React.ReactNode;
}

export const ModalPortal: React.FC<ModalPortalProps> = ({ children }) => {
  // Create portal target if it doesn't exist
  let portalRoot = document.getElementById('modal-root');
  if (!portalRoot) {
    portalRoot = document.createElement('div');
    portalRoot.id = 'modal-root';
    portalRoot.style.position = 'fixed';
    portalRoot.style.top = '0';
    portalRoot.style.left = '0';
    portalRoot.style.width = '100%';
    portalRoot.style.height = '100%';
    portalRoot.style.zIndex = '10000';
    portalRoot.style.pointerEvents = 'none';
    document.body.appendChild(portalRoot);
  }

  return createPortal(
    <div style={{ pointerEvents: 'auto' }}>
      {children}
    </div>,
    portalRoot
  );
};