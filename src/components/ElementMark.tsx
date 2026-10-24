import React from 'react';

interface ElementMarkProps {
  className?: string;
  title?: string;
}

/** A five-petal lotus mark, drawn as light, separate contours. */
export const ElementMark: React.FC<ElementMarkProps> = ({ className = '', title = 'Fozhu five elements mark' }) => (
  <svg className={className} viewBox="0 0 32 32" role="img" aria-label={title} fill="none">
    <g strokeWidth=".9" strokeLinejoin="round" strokeLinecap="round">
      {/* Short outside petals frame the familiar three-petal lotus instead of crowding it. */}
      <path d="M15.5 25C10.9 24.1 6.9 21 4.2 16.2C9.7 15.7 13.8 19 15.5 25Z" fill="#7896A0" stroke="#321A0F" />
      <path d="M16.5 25C21.1 24.1 25.1 21 27.8 16.2C22.3 15.7 18.2 19 16.5 25Z" fill="#E1D6C8" stroke="#321A0F" />
      <path d="M16 25C11.4 23 7.8 18 7.6 12C12.9 12.7 15.6 17.6 16 25Z" fill="#66836B" stroke="#321A0F" />
      <path d="M16 25C20.6 23 24.2 18 24.4 12C19.1 12.7 16.4 17.6 16 25Z" fill="#BC6850" stroke="#321A0F" />
      <path d="M16 25C12.2 19.9 12.6 12.2 16 5.5C19.4 12.2 19.8 19.9 16 25Z" fill="#D3AA62" stroke="#321A0F" />
      <path d="M12.2 23.2Q16 25.7 19.8 23.2" stroke="#321A0F" strokeWidth=".75" />
    </g>
  </svg>
);
