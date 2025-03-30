import React from "react";
import "./Tooltip.css";

interface TooltipProps {
  content: string;
  x: number;
  y: number;
  setTooltip: React.Dispatch<
    React.SetStateAction<{ content: string; x: number; y: number } | null>
  >;
}

const Tooltip: React.FC<TooltipProps> = ({ content, x, y, setTooltip }) => {
  return (
    <div
      id="tooltip"
      className="tooltip showing"
      style={{ left: `${x}px`, top: `${y}px`, position: "absolute" }}
      dangerouslySetInnerHTML={{ __html: content }}
      onMouseEnter={() => setTooltip((prev) => prev)}
      onMouseLeave={() => setTooltip(null)}
    />
  );
};

export default Tooltip;
