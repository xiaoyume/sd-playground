import React, { useCallback, useRef, useState, useMemo, useEffect } from 'react';
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

  const {
    nodes: storeNodes,
    edges: storeEdges,
    setNodes: setStoreNodes,
    setEdges: setStoreEdges,
    analysisResult,
  } = useStore();

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

  const isSyncingFromStore = useRef(false);
  const prevStoreNodesRef = useRef<string>('');
  const prevStoreEdgesRef = useRef<string>('');

  // Sync store → local when store changes (e.g., "Load Reference" click)
  useEffect(() => {
    const storeNodesStr = JSON.stringify(storeNodes);
    if (storeNodesStr !== prevStoreNodesRef.current) {
      prevStoreNodesRef.current = storeNodesStr;
      const localNodesStr = JSON.stringify(nodes);
      if (storeNodesStr !== localNodesStr) {
        isSyncingFromStore.current = true;
        setNodes(storeNodes);
      }
    }
  }, [storeNodes]);

  useEffect(() => {
    const storeEdgesStr = JSON.stringify(storeEdges);
    if (storeEdgesStr !== prevStoreEdgesRef.current) {
      prevStoreEdgesRef.current = storeEdgesStr;
      const localEdgesStr = JSON.stringify(edges);
      if (storeEdgesStr !== localEdgesStr) {
        isSyncingFromStore.current = true;
        setEdges(storeEdges);
      }
    }
  }, [storeEdges]);

  // Update store when local nodes/edges change
  useEffect(() => {
    if (isSyncingFromStore.current) {
      isSyncingFromStore.current = false;
      return;
    }
    setStoreNodes(nodes);
  }, [nodes, setStoreNodes]);

  useEffect(() => {
    if (isSyncingFromStore.current) {
      isSyncingFromStore.current = false;
      return;
    }
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

      let className = '';
      if (loadInfo.status === 'warning') {
        className = 'node-warning';
      } else if (loadInfo.status === 'overloaded') {
        className = 'node-overloaded';
      }

      return {
        ...node,
        className,
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
