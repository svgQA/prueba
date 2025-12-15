// export interface IGaugeProps {
//   progress: number;
//   size?: number;
//   stroke?: number;
//   color?: string;
// }

export interface IGaugeItem {
  progress: number;
  color: string;
}

export interface IGaugeProps {
  gauges: IGaugeItem[];
  size?: number;
  stroke?: number;
}
