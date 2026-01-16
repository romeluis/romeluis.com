import React from 'react';
import MarkdownText from '../shared/MarkdownText';
import './AboutComponent.css';

interface AboutComponentProps {
  text: string;
  color: string;
}

const AboutComponent: React.FC<AboutComponentProps> = ({ text, color }) => {
  return (
    <div className="about-component" style={{ backgroundColor: color }}>
      <h2 className="about-component__title">About</h2>
      <MarkdownText className="about-component__text">{text}</MarkdownText>
    </div>
  );
};

export default AboutComponent;
