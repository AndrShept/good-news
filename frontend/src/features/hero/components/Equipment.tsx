
// import { cn } from '@/lib/utils';
// import { BASE_EQUIPMENTS_IMAGE } from '@/shared/constants';

// interface Props {
//   equipments: Equipment[];
// }

// export const HeroEquipments = ({ equipments }: Props) => {
//   const equipmentBySlot = equipments.reduce(
//     (acc, equip) => {
//       acc[equip.slot] = equip;
//       return acc;
//     },
//     {} as Record<EquipmentSlot, Equipment>,
//   );

//   return (
//     <div className="flex">
//       <ul className="flex flex-col gap-0.5">
//         {BASE_EQUIPMENTS_IMAGE.slice(0, 5).map((equipment) => (
//           <li className="size-12 border flex" key={equipment.id}>
//             {equipmentBySlot?.[equipment.slot] ? (
//               <EquipmentItemCard
//                 equipment={equipmentBySlot[equipment.slot]}
//                 isContextMenuShow={true}
//                 isDoubleCLick={true}
//               />
//             ) : (
//               <img
//                 style={{ imageRendering: 'pixelated' }}
//                 className={cn('grayscale opacity-15 size-full', {
//                   'size-8 m-auto':
//                     equipment.slot === 'RING_LEFT' ||
//                     equipment.slot === 'RING_RIGHT' ||
//                     equipment.slot === 'AMULET',
//                 })}
//                 src={equipment.imageUrl}
//                 alt=""
//               />
//             )}
//           </li>
//         ))}
//       </ul>
//       <div className="mx-auto">
//         <img
//           className=" "
//           src={'sprites/hero-image/hero-2.jpg'}
//           alt="hero-image"
//         />
//       </div>
//       <ul className="flex flex-col gap-0.5">
//         {equipmentsHeroList.slice(5, 10).map((equipment) => (
//           <li className="size-12 border flex" key={equipment.id}>
//             {equipmentBySlot?.[equipment.slot] ? (
//               <EquipmentItemCard
//                 equipment={equipmentBySlot[equipment.slot]}
//                 isContextMenuShow={true}
//                 isDoubleCLick={true}
//               />
//             ) : (
//               <img
//                 style={{ imageRendering: 'pixelated' }}
//                 className={cn('grayscale opacity-15 size-full', {
//                   'size-8 m-auto':
//                     equipment.slot === 'RING_LEFT' ||
//                     equipment.slot === 'RING_RIGHT' ||
//                     equipment.slot === 'AMULET',
//                 })}
//                 src={equipment.imageUrl}
//                 alt=""
//               />
//             )}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };
