// packages/react-server-dom-esm/src/client/ReactFlightClientConfigBundler.d.ts
import type { ModuleLoading } from "react-client/src/ReactFlightClientConfig"

export type { ServerManifest, ClientReferenceMetadata, ClientReference } from "./ReactFlightClientConfigTarget"

export {
  prepareDestinationForModule,
  resolveClientReference,
  resolveServerReference,
  preloadModule,
  requireModule,
} from "./ReactFlightClientConfigTarget"

export function prepareDestinationForModuleImpl(
  moduleLoading: ModuleLoading,
  chunks: mixed,
  nonce: string | undefined,
): void
