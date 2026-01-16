import React from 'react';
import './TitleComponent.css';

interface TitleComponentProps {
  title: string;
  subtitle?: string;
}

const TitleComponent: React.FC<TitleComponentProps> = ({ title, subtitle }) => {
  return (
    <div className="title-component">
      <h2 className="title-component__title">{title}</h2>
      {subtitle && <p className="title-component__subtitle">{subtitle}</p>}
    </div>
  );
};

export default TitleComponent;
