// useReactFlowUtils.ts
import {type Edge, type Node, type NodeTypes, useReactFlow } from '@xyflow/react';

export const useReactFlowUtils = () => {
  const { setNodes, setEdges,getEdge } = useReactFlow<Node, Edge>();

  const removeNode = (id:string) => {  
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
  };

  const removeEdgesConnectedToNode = (id: string) => {
    setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
  };

  const removeEdge = (id: string) => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id ));
  };

  // const updateEdgeData = (id:string, newData:any) => {
  //   setEdges((edges)=> edges.map((edge)=>edge.id===id?{...edge,data:{...edge.data, newData }}:edge));
  //   // console.log(getEdge(id));
  // };

  return {
    removeNode,
    removeEdge,
    removeEdgesConnectedToNode,
    // updateEdgeData,
  };
};
