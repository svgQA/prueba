import { VNode } from 'preact';
import { GridBody, GridBodyProps } from './grid-body';

export type GridProps = GridBodyProps;
export const Grid = (props: GridProps): VNode => {
  return (
    <g className='grid'>
      <GridBody {...props} />
    </g>
  );
};
