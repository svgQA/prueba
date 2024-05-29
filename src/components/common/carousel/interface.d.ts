import { type PropsWithChildren } from 'preact/compat';
import { type IComponentProps } from '../interface';
import { type VNode } from 'preact';

interface ICarouselProps extends IComponentProps, PropsWithChildren {
  children?: VNode[];
  visibleCount: number;
}

interface ISlideProps extends PropsWithChildren {}
