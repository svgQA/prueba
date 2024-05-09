// import { NodeData } from '@/libs/types/devices';
// import { DevicesEvents } from '@/libs/utils/events';
// import { Handle, NodeProps, Position } from 'reactflow';

// export const GatewayNode = (props: NodeProps<NodeData>) => {
//     const { isConnectable, data } = props;

//     const showGraph = () => {
//         DevicesEvents.openSettings.emmit(data);
//     };

//     return (
//         <div className="relative inline-flex rounded-sm bg-rose-500 px-2 shadow-md">
//             <span className="vx-icon vx-gateway"></span>
//             {
//                 data.monitor && (
//                     <>
//                         <div className="absolute inline-flex font-black items-center text-[5px] justify-center w-7 h-3 text-white bg-teal-500 rounded-full -bottom-2 -start-4 border-2 border-white">
//                             { data.monitor.battery }%
//                         </div>
//                     </>
//                 )
//             }
//             <button onClick={showGraph} className="hover:bg-stone-600 hover:border-stone-600 absolute inline-flex font-black items-center text-[5px] justify-center w-4 h-4 text-white bg-stone-500 rounded-full -bottom-2 -end-2">
//                 <span className="vx-icon vx-graph"></span>
//             </button>
//             <div className="absolute inline-flex font-black items-center text-[5px] justify-center w-9 h-3 text-white bg-sky-500 rounded-full -top-2 -start-4 border-2 border-white">
//                 { data.name }
//             </div>
//             <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
//             <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
//         </div>
//     );
// }
