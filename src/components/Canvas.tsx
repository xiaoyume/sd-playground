import React, { useCallback, useRef, useState } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  ReactFlowProvider,
} from 'reactflow';
import type { Connection, Node, ReactFlowInstance } from 'reactflow';
import 'reactflow/dist/style.css';
import useStore from '../store/useStore';

const Canvas: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const { setNodes: setStoreNodes, setEdges: setStoreEdges } = useStore();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type || !reactFlowInstance) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type: 'default',
        position,
        data: { label: type.toUpperCase() },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onInit = useCallback((instance: ReactFlowInstance) => {
    setReactFlowInstance(instance);
  }, []);

  // Update store when nodes or edges change
  React.useEffect(() => {
    setStoreNodes(nodes);
  }, [nodes, setStoreNodes]);

  React.useEffect(() => {
    setStoreEdges(edges);
  }, [edges, setStoreEdges]);

  return (
    <div className="canvas" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

const CanvasWithProvider: React.FC = () => (
  <ReactFlowProvider>
    <Canvas />
  </ReactFlowProvider>
);

export default CanvasWithProvider;
