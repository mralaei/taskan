import React from 'react';

const ParticleBackground: React.FC = () => {
  const particles = Array.from({ length: 50 }).map((_, i) => {
    const size = `${Math.random() * 3 + 1}px`;
    const style = {
      width: size,
      height: size,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 8}s`,
      animationDuration: `${Math.random() * 5 + 5}s`,
    };
    return <div className="particle" key={i} style={style}></div>;
  });

  return (
    <>
      <div id="particle-container">{particles}</div>
      <style>{`
        #particle-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
          overflow: hidden;
        }
        .particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(79, 70, 229, 0.4); /* var(--primary) with opacity */
          animation-name: soft-blink;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
        @keyframes soft-blink {
          0%, 100% { opacity: 0.1; transform: scale(0.7); }
          50% { opacity: 0.7; transform: scale(1); }
        }
      `}</style>
    </>
  );
};
export default ParticleBackground;