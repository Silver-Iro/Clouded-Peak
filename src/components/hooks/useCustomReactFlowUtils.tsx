// useReactFlowUtils.ts
import {type Edge, type Node, type NodeTypes, useReactFlow } from '@xyflow/react';

export const useReactFlowUtils = () => {
  const { setNodes, setEdges } = useReactFlow<Node, Edge>();

  const removeNode = (id:string) => {  
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
  };

  const removeEdgesConnectedToNode = (id: string) => {
    setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
  };

    const removeEdge= (id: string) => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id ));
  };

  return {
    removeNode,
    removeEdge,
    removeEdgesConnectedToNode,
  };
};
