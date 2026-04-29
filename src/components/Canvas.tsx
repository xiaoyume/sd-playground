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
import AnimatedEdge from './edges/AnimatedEdge';

const nodeTypes = {
  custom: CustomNode,
};

const edgeTypes = {
  animated: AnimatedEdge,
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
    isSimulating,
    animationSpeed,
  } = useStore();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, type: 'animated' }, eds)),
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

  // Get connected node IDs from edges
  const connectedNodeIds = useMemo(() => {
    const ids = new Set<string>();
    edges.forEach((edge) => {
      ids.add(edge.source);
      ids.add(edge.target);
    });
    return ids;
  }, [edges]);

  // Apply node styles and inject onDelete callback
  const styledNodes = useMemo(() => {
    const nodesWithDelete = nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        onDelete,
      },
    }));

    if (!analysisResult || !analysisResult.nodeLoadInfo || analysisResult.nodeLoadInfo.length === 0) {
      return nodesWithDelete.map((node) => {
        let className = '';
        if (isSimulating) {
          className = connectedNodeIds.has(node.id) ? 'node-active' : 'node-inactive';
        }
        return { ...node, className };
      });
    }

    return nodesWithDelete.map((node) => {
      const loadInfo = analysisResult.nodeLoadInfo.find((info) => info.nodeId === node.id);

      let className = '';
      if (isSimulating) {
        className = connectedNodeIds.has(node.id) ? 'node-active' : 'node-inactive';
      }
      if (loadInfo) {
        if (loadInfo.status === 'warning') {
          className = 'node-warning';
        } else if (loadInfo.status === 'overloaded') {
          className = 'node-overloaded';
        }
      }

      return {
        ...node,
        className,
      };
    });
  }, [nodes, analysisResult, isSimulating, connectedNodeIds, onDelete]);

  // Apply edge animation props
  const animatedEdges = useMemo(() => {
    return edges.map((edge) => {
      const isBottleneck = analysisResult?.bottleneckNodeIds?.includes(edge.target) || false;

      return {
        ...edge,
        type: 'animated',
        data: {
          isSimulating,
          animationSpeed,
          isBottleneck,
        },
      };
    });
  }, [edges, isSimulating, animationSpeed, analysisResult]);

  return (
    <div className="canvas" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={styledNodes}
        edges={animatedEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
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
