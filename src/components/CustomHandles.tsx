import { Handle, Position, } from '@xyflow/react';
import type { HandleType } from '@xyflow/react';

interface customHandleProps{
  position:Position,
  type:HandleType,
  id?:string}
const borderColorStone600 = '#4B5563';

export const CustomHandleOnHit = ({ position, type, id }: customHandleProps) => {
  return (
    <Handle
      type={type}
      id={id}
      position={position}
      onConnect={(params) => console.log('handle onConnect', params)}
      style={{
        width: 12,
        height: 12,
        transform: 'translate(6px, -20px)',
        backgroundColor: 'rgba(34,197,94,1)', // Tailwind green-400
        borderRadius: '9999px',
        border: `2px solid ${borderColorStone600}`,
        cursor: 'pointer',
        zIndex: 10,
      }}
    />
  );
};

export const CustomHandleOnBlock = ({ position, type, id }: customHandleProps) => {
  return (
    <Handle
      type={type}
      id={id}
      position={position}
      onConnect={(params) => console.log('handle onConnect', params)}
      style={{
        width: 12,
        height: 12,
        transform: 'translate(6px, 6px)',
        backgroundColor: '#b91c1c', // Tailwind red-700
        borderRadius: '9999px',
        border: `2px solid ${borderColorStone600}`,
        cursor: 'pointer',
        zIndex: 10,
      }}
    />
  );
};

export const CustomHandleOnChallenge = ({ position, type, id }: customHandleProps) => {
  return (
    <Handle
      type={type}
      id={id}
      position={position}
      onConnect={(params) => console.log('handle onConnect', params)}
      style={{
        width: 12,
        height: 12,
        transform: 'translate(6px, 32px)',
        backgroundColor: '#f59e0b', // Tailwind amber-500
        borderRadius: '9999px',
        border: `2px solid ${borderColorStone600}`,
        cursor: 'pointer',
        zIndex: 10,
      }}
    />
  );
};

export const CustomHandleIn = ({ position, type, id }: customHandleProps) => {
  return (
    <Handle
      type={type}
      id={id}
      position={position}
      onConnect={(params) => console.log('handle onConnect', params)}
      style={{
        width: 12,
        height: 12,
        transform: 'translate(-6px, 6px)',
        backgroundColor: '#d6d3d1', // Tailwind stone-300
        borderRadius: '9999px',
        border: `2px solid ${borderColorStone600}`,
        cursor: 'pointer',
        zIndex: 10,
      }}
    />
  );
};