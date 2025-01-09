import React from 'react';
import './LoadingSpinner.css';
import { FaSpinner } from 'react-icons/fa';

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <FaSpinner className="spinner" />
      <p>Generating image...</p>
    </div>
  );
};

export default LoadingSpinner;
