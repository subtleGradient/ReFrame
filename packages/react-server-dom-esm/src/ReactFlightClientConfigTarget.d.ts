// packages/react-server-dom-esm/src/client/ReactFlightClientConfigTarget.d.ts
import type {
  Thenable,
  FulfilledThenable,
  RejectedThenable,
} from 'shared/ReactTypes';
import type { ModuleLoading } from 'react-client/src/ReactFlightClientConfig';

export type ServerConsumerModuleMap = string; // Module root path

export type ServerManifest = string; // Module root path

export type ServerReferenceId = string;

export type ClientReferenceMetadata = [
  string, // module path
  string, // export name
];

// eslint-disable-next-line no-unused-vars
export opaque type ClientReference<T> = {
  specifier: string;
  name: string;
};

export declare function prepareDestinationForModule(
  moduleLoading: ModuleLoading,
  nonce: string | undefined,
  metadata: ClientReferenceMetadata,
): void;

export declare function resolveClientReference<T>(
  bundlerConfig: ServerConsumerModuleMap,
  metadata: ClientReferenceMetadata,
): ClientReference<T>;

export declare function resolveServerReference<T>(
  config: ServerManifest,
  id: ServerReferenceId,
): ClientReference<T>;

export declare function preloadModule<T>(
  metadata: ClientReference<T>,
): null | Thenable<any>;

export declare function requireModule<T>(metadata: ClientReference<T>): T;
