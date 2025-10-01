import React from 'react';

const AnimatedLogo: React.FC = () => {
  const text = "Taskan";
  return (
    <>
      <div className="animated-logo-container">
        {text.split('').map((char, index) => (
          <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
            {char}
          </span>
        ))}
      </div>
      <style>{`
        .animated-logo-container {
          font-family: var(--font-mono);
          font-size: 3rem;
          font-weight: 700;
          letter-spacing: -0.1em;
          display: flex;
          color: var(--primary);
          user-select: none;
        }
        .animated-logo-container span {
          display: inline-block;
          opacity: 0;
          transform: translateY(20px) scale(0.8);
          animation: pop-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes pop-in {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default AnimatedLogo;