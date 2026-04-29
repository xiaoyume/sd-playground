import React, { useCallback, useRef, useState, useMemo } from 'react';
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
import CustomNode from './CustomNode';

const nodeTypes = {
  custom: CustomNode,
};

const Canvas: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const { setNodes: setStoreNodes, setEdges: setStoreEdges, analysisResult } = useStore();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDelete = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    },
    [setNodes, setEdges]
  );

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
        type: 'custom',
        position,
        data: { label: type.toUpperCase(), onDelete },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes, onDelete]
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

  // Apply node styles based on analysis result
  const styledNodes = useMemo(() => {
    if (!analysisResult || !analysisResult.nodeLoadInfo || analysisResult.nodeLoadInfo.length === 0) {
      return nodes;
    }

    return nodes.map((node) => {
      const loadInfo = analysisResult.nodeLoadInfo.find((info) => info.nodeId === node.id);

      if (!loadInfo) {
        return node;
      }

      let backgroundColor = '#e8f5e9'; // green - normal
      let borderColor = '#4caf50';

      if (loadInfo.status === 'warning') {
        backgroundColor = '#fff3e0'; // yellow
        borderColor = '#ff9800';
      } else if (loadInfo.status === 'overloaded') {
        backgroundColor = '#ffebee'; // red
        borderColor = '#f44336';
      }

      return {
        ...node,
        style: {
          backgroundColor,
          borderColor,
          borderWidth: 2,
          borderRadius: 8,
          padding: '10px',
        },
      };
    });
  }, [nodes, analysisResult]);

  return (
    <div className="canvas" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={styledNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
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
