import React, { useEffect, useState, useId } from 'react';
import mermaid from 'mermaid';
import './MermaidComponent.css';

interface MermaidComponentProps {
  diagramCode: string;
  title?: string;
  caption?: string;
}

// Initialize mermaid once globally with custom theme
let isInitialized = false;

const initializeMermaid = () => {
  if (isInitialized) return;

  mermaid.initialize({
    startOnLoad: false,
    theme: 'base',
    securityLevel: 'strict', // Enables sanitization
    themeVariables: {
        // Font family matching your design system
        fontFamily: 'Neue Montreal, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        fontSize: '14px',

        // Primary colors - Blue nodes
        primaryColor: '#02a6ff',
        primaryTextColor: '#120e14',
        primaryBorderColor: '#120e14',

        // Secondary - Green nodes
        secondaryColor: '#91bf4b',
        secondaryTextColor: '#120e14',
        secondaryBorderColor: '#120e14',

        // Tertiary - Yellow nodes
        tertiaryColor: '#ffd05d',
        tertiaryTextColor: '#120e14',
        tertiaryBorderColor: '#120e14',

        // Backgrounds and text
        mainBkg: '#ffffff',
        textColor: '#120e14',
        background: '#ffffff',
        lineColor: '#120e14',

        // Accents - Pink for special elements
        noteBkgColor: '#f96ba4',
        noteBorderColor: '#120e14',
        noteTextColor: '#120e14',

        // Additional node colors
        nodeBorder: '#120e14',
        clusterBkg: '#e2e2e2',
        clusterBorder: '#120e14',
        defaultLinkColor: '#120e14',

        // Edge/arrow colors
        edgeLabelBackground: '#ffffff',

        // Specific diagram elements
        titleColor: '#120e14',

        // Flowchart specific
        nodeTextColor: '#120e14',

        // Sequence diagram - colorful actors
        actorBkg: '#02a6ff',
        actorBorder: '#120e14',
        actorTextColor: '#120e14',
        actorLineColor: '#120e14',
        signalColor: '#120e14',
        signalTextColor: '#120e14',
        labelBoxBkgColor: '#ffd05d',
        labelBoxBorderColor: '#120e14',
        labelTextColor: '#120e14',
        loopTextColor: '#120e14',
        activationBorderColor: '#120e14',
        activationBkgColor: '#91bf4b',
        sequenceNumberColor: '#120e14',

        // Class diagram
        classText: '#120e14',

        // State diagram
        labelColor: '#120e14',

        // Git/Journey colors - use full palette
        git0: '#02a6ff',
        git1: '#91bf4b',
        git2: '#ffd05d',
        git3: '#f96ba4',
        git4: '#f26a2d',
        git5: '#e2e2e2',
        git6: '#afafaf',
        git7: '#120e14',

        // Pie chart - vibrant colors
        pie1: '#02a6ff',
        pie2: '#91bf4b',
        pie3: '#ffd05d',
        pie4: '#f96ba4',
        pie5: '#f26a2d',
        pie6: '#e2e2e2',
        pie7: '#afafaf',
        pie8: '#120e14',
        pie9: '#02a6ff',
        pie10: '#91bf4b',
        pie11: '#ffd05d',
        pie12: '#f96ba4',
        pieTitleTextColor: '#120e14',
        pieLegendTextColor: '#120e14',
        pieStrokeColor: '#120e14',
        pieStrokeWidth: '2px',
      },
      flowchart: {
        curve: 'basis',
        padding: 20,
        nodeSpacing: 60,
        rankSpacing: 60,
        diagramPadding: 20,
        htmlLabels: true,
      },
    });

  isInitialized = true;
};

const MermaidComponent: React.FC<MermaidComponentProps> = ({
  diagramCode,
  title,
  caption
}) => {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const componentId = useId();
  const diagramId = `mermaid-${componentId.replace(/:/g, '-')}`;

  useEffect(() => {
    // Initialize mermaid only once
    initializeMermaid();

    const renderDiagram = async () => {
      try {
        setError(null);
        // mermaid.render returns { svg } object
        const { svg: renderedSvg } = await mermaid.render(diagramId, diagramCode);
        setSvg(renderedSvg);
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError(err instanceof Error ? err.message : 'Invalid diagram syntax');
        setSvg(''); // Clear previous diagram on error
      }
    };

    renderDiagram();
  }, [diagramCode, diagramId]);

  if (error) {
    return (
      <div className="mermaid-component mermaid-component--error">
        <p>Unable to render diagram: {error}</p>
      </div>
    );
  }

  return (
    <div className="mermaid-component">
      {title && (
        <h3 className="mermaid-component__title">{title}</h3>
      )}
      <div
        className="mermaid-component__diagram"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      {caption && (
        <p className="mermaid-component__caption">{caption}</p>
      )}
    </div>
  );
};

export default MermaidComponent;
