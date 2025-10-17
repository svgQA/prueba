import { type PropsWithChildren } from 'preact/compat';
import { type VNode } from 'preact';
import { type IComponentProps } from '@/components/utils/interface';

interface ICarouselProps extends IComponentProps, PropsWithChildren {
  children?: VNode[];
  visibleCount: number;
}

interface ISlideProps extends PropsWithChildren {}
