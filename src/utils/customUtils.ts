

export const invertNumericValues = (value: string|number) => {
    console.log(`value ${value} and type ${typeof value}`)
    if (typeof value ==="string" ){
      return value.replace(/[+-]/g, (m) => (m === "+" ? "-" : "+"));
    }
    else if (typeof value === "number"){
      return -value;
    }
    else {
      console.log("Inverting value failed: ", value);
      return value;
    }
  };


export const formatAdvantage = (value: string): string => {
    const str = value != null ? String(value) : '';
    // Extract first integer from string (can be negative)
    const matched = str.match(/-?\d+/);
    if (!matched) return str; // fallback if no number found

    const num = parseInt(matched[0], 10);
    
    // Add "+" only if positive
    return num > 0 ? `+${num}` : `${num}`;
}


export const getEffectiveStartup = (node, edges, getNode) => {
  const parseNum = (v: any) => {
    const n = parseInt(String(v));
    return Number.isFinite(n) ? n : 0;
  };

  const incomingEdges = edges.filter(e => e.target === node.id);
  if (!incomingEdges.length) return parseNum(node.data.startupValue);

  const lastEdge = incomingEdges[incomingEdges.length - 1];
  const sourceNode = getNode(lastEdge.source); // <-- changed

  const startup = parseNum(node.data.startupValue);
  const hit = parseNum(sourceNode?.data?.on_hitValue);
  const block = parseNum(sourceNode?.data?.on_blockValue);
  const ch = parseNum(sourceNode?.data?.on_chValue);

  if (lastEdge.sourceHandle === 'hit') return startup - hit;
  if (lastEdge.sourceHandle === 'block') return startup - block;
  if (lastEdge.sourceHandle === 'chall') return startup - ch;
  return startup;
}