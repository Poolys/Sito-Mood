"use client";

import React from "react";

interface PoolyAIChatButtonProps {
onClick: () => void;
isOpen?: boolean;
}

export default function PoolyAIChatButton({
onClick,
isOpen = false,
}: PoolyAIChatButtonProps) {
return (
<>
<style>{`
@keyframes poolyPulse {
0%, 100% {
transform: scale(1);
box-shadow:
0 4px 12px rgba(0, 0, 0, 0.6),
inset 0 1px 0 rgba(212, 175, 55, 0.2),
0 0 20px rgba(212, 175, 55, 0);
}

      50% {
        transform: scale(1.02);
        box-shadow:
          0 4px 12px rgba(0, 0, 0, 0.6),
          inset 0 1px 0 rgba(212, 175, 55, 0.3),
          0 0 30px rgba(212, 175, 55, 0.15);
      }
    }

    .pooly-button {
      position: fixed;
      bottom: 1.25rem;
      right: 1.25rem;
      z-index: 9999;

      width: 72px;
      height: 72px;
      border-radius: 50%;

      border: 1.5px solid #d4af37;

      background: radial-gradient(
        circle at 30% 30%,
        #2a2a2a,
        #1f1f1f
      );

      box-shadow:
        0 4px 12px rgba(0, 0, 0, 0.6),
        inset 0 1px 0 rgba(212, 175, 55, 0.2);

      cursor: pointer;
      transition: all 0.3s ease;

      display: flex;
      align-items: center;
      justify-content: center;

      font-family: "Prata", "Cormorant Garamond", serif;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.05em;
      color: #e6d9c3;

      padding: 0;
    }

    .pooly-button:hover {
      transform: scale(1.08);

      box-shadow:
        0 6px 20px rgba(0, 0, 0, 0.7),
        inset 0 1px 0 rgba(230, 197, 71, 0.3),
        0 0 25px rgba(212, 175, 55, 0.2);

      background: radial-gradient(
        circle at 30% 30%,
        #333333,
        #242424
      );

      border-color: #e6c547;
    }

    .pooly-button:active {
      transform: scale(0.96);

      box-shadow:
        0 2px 8px rgba(0, 0, 0, 0.5),
        inset 0 1px 0 rgba(212, 175, 55, 0.15);
    }

    .pooly-button.pulse {
      animation: poolyPulse 3s ease-in-out infinite;
    }

    .pooly-button:focus-visible {
      outline: 2px solid #d4af37;
      outline-offset: 2px;
    }
  `}</style>

  <button
    type="button"
    onClick={onClick}
    aria-label="Apri chat PoolyAI"
    aria-pressed={isOpen}
    className={`pooly-button ${isOpen ? "pulse" : ""}`}
  ><button
type="button"
onClick={() => {
console.log("PoolyAI button clicked");
setOpen((v) => !v);
}}
className="fixed bottom-5 right-5 z-[9999] flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-fg text-sm font-semibold shadow-lg hover:shadow-xl transition-shadow cursor-pointer pointer-events-auto"
aria-label="Apri PoolyAI"
aria-pressed={open}

PoolyAI
</button>
</>


);
}