import React from 'react';
import { BaseEdge, getBezierPath } from 'reactflow';
import type { EdgeProps } from 'reactflow';

interface EdgeData {
  isSimulating?: boolean;
  animationSpeed?: number;
  isBottleneck?: boolean;
}

const AnimatedEdge: React.FC<EdgeProps<EdgeData>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
}) => {
  const isSimulating = data?.isSimulating ?? false;
  const animationSpeed = data?.animationSpeed ?? 1;
  const isBottleneck = data?.isBottleneck ?? false;

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const animationDuration = `${Math.max(0.5, 3 / animationSpeed)}s`;
  const edgeColor = isBottleneck ? '#ef4444' : '#94a3b8';
  const particleColor = isBottleneck ? '#fca5a5' : '#60a5fa';

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={{ ...style, stroke: edgeColor }} />
      {isSimulating && (
        <circle r="4" fill={particleColor} className="edge-particle">
          <animateMotion
            dur={animationDuration}
            repeatCount="indefinite"
            path={edgePath}
          />
        </circle>
      )}
    </>
  );
};

export default AnimatedEdge;
