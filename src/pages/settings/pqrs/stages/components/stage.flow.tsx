import { FunctionComponent } from 'preact';
import { useMemo } from 'preact/hooks';

import ReactFlow, {
  Background,
  Controls,
  Edge,
  MarkerType,
  MiniMap,
  Node,
  NodeProps,
  ReactFlowProvider,
} from 'reactflow';

import { useTranslation } from 'react-i18next';
import { IStages } from '../utils/interface';

import 'reactflow/dist/style.css';

type StageNodeData = {
  label: string;
  status?: string;
  goal?: string | null;
  executionNotes?: string | null;
};

const getStatusStyles = (status?: string) => {
  const normalized = status?.toLowerCase();
  if (normalized === 'active')
    return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100';
  if (normalized === 'draft')
    return 'bg-amber-50 text-amber-700 ring-1 ring-amber-100';
  if (normalized === 'inactive')
    return 'bg-slate-100 text-slate-600 ring-1 ring-slate-200';
  return 'bg-sky-50 text-sky-700 ring-1 ring-sky-100';
};

const StageNode: FunctionComponent<NodeProps<StageNodeData>> = ({ data }) => {
  const { label, status, goal, executionNotes } = data;

  return (
    <div className='rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-[0_14px_40px_rgba(15,23,42,0.08)] backdrop-blur-sm w-[240px]'>
      <div className='flex items-start justify-between gap-2'>
        <div className='flex flex-col gap-1'>
          <span className='text-sm font-semibold text-slate-900 leading-tight'>
            {label}
          </span>
          {goal && (
            <p className='text-xs text-slate-500 line-clamp-2'>{goal}</p>
          )}
        </div>
        <span
          className={`px-2 py-1 text-[11px] font-semibold rounded-full ${getStatusStyles(status)}`}
        >
          {status || '—'}
        </span>
      </div>
      {executionNotes && (
        <p className='mt-2 text-xs text-slate-500 line-clamp-2 border-t border-slate-100 pt-2'>
          {executionNotes}
        </p>
      )}
    </div>
  );
};

const nodeTypes = {
  stage: StageNode,
};

interface StageFlowProps {
  stages: IStages[];
}

export const StageFlow: FunctionComponent<StageFlowProps> = ({ stages }) => {
  const { t } = useTranslation();

  const layout = useMemo(() => {
    const columns = Math.max(
      1,
      Math.ceil(Math.sqrt(Math.max(stages.length, 1)))
    );
    const spacingX = 320;
    const spacingY = 220;

    const nodes: Node<StageNodeData>[] = stages.map((stage, index) => {
      const row = Math.floor(index / columns);
      const column = index % columns;

      return {
        id: String(stage.id ?? index),
        type: 'stage',
        position: { x: column * spacingX, y: row * spacingY },
        data: {
          label: stage.stageName,
          status: stage.status,
          goal: stage.goal,
          executionNotes: stage.executionNotes,
        },
      } satisfies Node<StageNodeData>;
    });

    const edges: Edge[] = [];

    stages.forEach((stage) => {
      const source = stage.id ? String(stage.id) : undefined;
      if (!source) return;

      const connections: Array<{
        key: string;
        target?: number | null;
        color: string;
        label: string;
      }> = [
        {
          key: 'next',
          target: stage.nextStageId,
          color: '#22c55e',
          label: t('h_next_stage'),
        },
        {
          key: 'prev',
          target: stage.prevStageId,
          color: '#0ea5e9',
          label: t('h_prev_stage'),
        },
        {
          key: 'error',
          target: stage.errorStageId,
          color: '#f97316',
          label: t('h_error_stage'),
        },
      ];

      connections.forEach(({ key, target, color, label }) => {
        if (!target) return;

        edges.push({
          id: `${source}-${key}-${target}`,
          source,
          target: String(target),
          label,
          animated: key !== 'prev',
          style: { stroke: color, strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color,
          },
          labelBgPadding: [6, 4],
          labelBgBorderRadius: 12,
          labelBgStyle: { fill: '#fff', fillOpacity: 0.85, stroke: '#e2e8f0' },
          labelStyle: { fill: '#0f172a', fontWeight: 600, fontSize: 11 },
        });
      });
    });

    return { nodes, edges };
  }, [stages, t]);

  if (!stages.length) {
    return (
      <section>
        <div className='flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-10 text-center'>
          <div className='flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-inner shadow-slate-200'>
            <i className='vox-icon vx-icon-191 text-2xl text-primary' />
          </div>
          <div className='space-y-1'>
            <h3 className='text-lg font-semibold text-slate-900'>
              {t('h_stages')}
            </h3>
            <p className='max-w-xl text-sm text-slate-500'>
              {t(
                'i_stages_empty',
                'Crea etapas para visualizar cómo se conectan dentro del flujo de PQRS.'
              )}
              <span className='sr-only'>.</span>
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between absolute'>
        <div className='flex items-center gap-2 rounded-full bg-slate-100/80 px-3 py-2 text-xs text-slate-600 shadow-inner'>
          <span className='flex items-center gap-1'>
            <span className='h-2 w-2 rounded-full bg-emerald-500' />
            {t('h_next_stage')}
          </span>
          <span className='flex items-center gap-1'>
            <span className='h-2 w-2 rounded-full bg-sky-500' />
            {t('h_prev_stage')}
          </span>
          <span className='flex items-center gap-1'>
            <span className='h-2 w-2 rounded-full bg-orange-500' />
            {t('h_error_stage')}
          </span>
        </div>
      </div>

      <div className='h-[68vh] overflow-hidden rounded-2xl bg-gradient-to-b dark:from-b-dark dark:to-b-dark-light from-white via-white to-slate-50'>
        <ReactFlowProvider>
          <ReactFlow
            nodes={layout.nodes}
            edges={layout.edges}
            nodeTypes={nodeTypes}
            fitView
            proOptions={{ hideAttribution: true }}
            defaultEdgeOptions={{ type: 'smoothstep' }}
          >
            <MiniMap
              pannable
              zoomable
              nodeColor='#94a3b8'
              maskColor='rgba(148,163,184,0.08)'
              position='top-right'
            />
            <Controls position='bottom-right' showInteractive={false} />
            <Background gap={10} size={0.4} color='#e2e8f0' />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </section>
  );
};
