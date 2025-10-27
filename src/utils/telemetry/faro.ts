import { app_environment, default_service_url } from '@/env.config';
import {
  initializeFaro,
  getWebInstrumentations,
  faro,
  FetchTransport,
} from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';

export type FaroSetting = {
  name?: string;
  version?: string;
  tenant: () => string;
  token: () => string;
  company?: () => string;
};

export class FaroManager {
  private static initialized = false;

  static connect(
    tenant: () => string,
    company: () => string | undefined,
    token: () => string,
    user: () => string
  ) {
    const _token = token();

    if (!FaroManager.initialized) {
      initializeFaro({
        app: {
          name: 'tryvoo-web',
          version: __APP_VERSION__,
          environment: app_environment,
        },
        transports: [
          new FetchTransport({
            url: `${default_service_url}/telemetry/faro/collect`,
            requestOptions: {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: _token,
                'voxline-tenant': tenant(),
                'voxline-company': company() ?? '0',
              },
            },
          }),
        ],
        instrumentations: [
          ...getWebInstrumentations(),
          new TracingInstrumentation(),
        ],
      });

      FaroManager.initialized = true;
    }

    faro.api.setSession({
      attributes: {
        tenant: tenant(),
        company: company() || 'default',
        user: user(),
      },
    });
  }
}
