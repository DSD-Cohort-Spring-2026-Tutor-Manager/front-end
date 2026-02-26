import React from 'react';
import './Alert.css';

type AlertType = 'success';

type AlertProps = {
  type: AlertType;
  text: string;
  className?: string;
};

const Alert = ({ type, text, className = '' }: AlertProps) => {
  const colorMap = new Map<string, string>([['success', 'success-alert']]);

  const colorClass = colorMap.get(type);

  return (
    <div
      className={`floating-alert alert-animate ${colorClass} ${className}`.trim()}
    >
      <p>{text}</p>
    </div>
  );
};

export default Alert;
