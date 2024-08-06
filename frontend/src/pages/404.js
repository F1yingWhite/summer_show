import React from 'react';
import { Button } from 'antd';
import { Link } from 'react-router-dom';

export function NotFound() {
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80vh',
    background: 'linear-gradient(135deg, #f0f4f8, #d9e2ec)',
    textAlign: 'center',
  };

  const contentStyle = {
    maxWidth: '600px',
    padding: '24px',
    background: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  const titleStyle = {
    fontSize: '96px',
    fontWeight: 'bold',
    color: '#ff6b6b',
    margin: '0',
  };

  const messageStyle = {
    fontSize: '24px',
    color: '#333',
    margin: '0',
  };

  const descriptionStyle = {
    fontSize: '16px',
    color: '#555',
    margin: '16px 0',
  };

  const buttonStyle = {
    marginTop: '24px',
  };

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        <h1 style={titleStyle}>404</h1>
        <p style={messageStyle}>Oops! Page not found.</p>
        <p style={descriptionStyle}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/">
          <Button type="primary" size="large" style={buttonStyle}>
            Go to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
