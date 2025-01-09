import React from 'react';
import './ErrorMessage.css';
import { FaExclamationTriangle } from 'react-icons/fa';

const ErrorMessage = ({ message }) => {
  return (
    <div className="error-message">
      <FaExclamationTriangle className="error-icon" />
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;
