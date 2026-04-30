import React, { useCallback, useRef, useState, useMemo, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  Controls,
  Background,
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

interface DesignCanvasProps {
  designId: string;
}

const DesignCanvasInner: React.FC<DesignCanvasProps> = ({ designId }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const isInitialized = useRef(false);
  const isUpdating = useRef(false);

  const {
    updateDesignGraph,
    getDesignById,
  } = useStore();

  const design = getDesignById(designId);
  const isSimulating = design?.isSimulating ?? false;
  const animationSpeed = design?.animationSpeed ?? 1;

  // Initialize from store on mount
  useEffect(() => {
    if (design && !isInitialized.current) {
      isUpdating.current = true;
      setNodes(design.nodes);
      setEdges(design.edges);
      isInitialized.current = true;
      // Wait for state to settle before allowing sync back
      setTimeout(() => { isUpdating.current = false; }, 0);
    }
  }, [designId]);

  // Sync local changes back to store (only when user makes changes)
  useEffect(() => {
    if (isInitialized.current && !isUpdating.current) {
      updateDesignGraph(designId, nodes, edges);
    }
  }, [nodes, edges, designId]);

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
      if (typeof type === 'undefined' || !type || !reactFlowInstance) return;

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
    const analysisResult = design?.analysisResult;
    const nodesWithDelete = nodes.map((node) => ({
      ...node,
      data: { ...node.data, onDelete },
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
        if (loadInfo.status === 'warning') className = 'node-warning';
        else if (loadInfo.status === 'overloaded') className = 'node-overloaded';
      }
      return {
        ...node,
        className,
        data: { ...node.data, loadInfo },
      };
    });
  }, [nodes, design?.analysisResult, isSimulating, connectedNodeIds, onDelete]);

  // Apply edge animation props
  const animatedEdges = useMemo(() => {
    const analysisResult = design?.analysisResult;
    return edges.map((edge) => {
      const isBottleneck = analysisResult?.bottleneckNodeIds?.includes(edge.target) || false;
      return {
        ...edge,
        type: 'animated',
        data: { isSimulating, animationSpeed, isBottleneck },
      };
    });
  }, [edges, isSimulating, animationSpeed, design?.analysisResult]);

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

const DesignCanvas: React.FC<DesignCanvasProps> = (props) => (
  <ReactFlowProvider>
    <DesignCanvasInner {...props} />
  </ReactFlowProvider>
);

export default DesignCanvas;
