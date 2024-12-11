// packages/react-server-dom-esm/src/server/ReactFlightServerConfigESMBundler.d.ts
import type { ReactClientValue } from "react-server/src/ReactFlightServer"

import type { ClientReference, ServerReference } from "../ReactFlightESMReferences"

export type { ClientReference, ServerReference }

export type ClientManifest = string // base URL on the file system

export type ServerReferenceId = string

export type ClientReferenceMetadata = [
  string, // module path
  string, // export name
]

export type ClientReferenceKey = string

export { isClientReference, isServerReference } from "../ReactFlightESMReferences"

export declare function getClientReferenceKey(reference: ClientReference<any>): ClientReferenceKey

export declare function resolveClientReferenceMetadata<T>(
  config: ClientManifest,
  clientReference: ClientReference<T>,
): ClientReferenceMetadata

export declare function getServerReferenceId<T>(
  config: ClientManifest,
  serverReference: ServerReference<T>,
): ServerReferenceId

export declare function getServerReferenceBoundArguments<T>(
  config: ClientManifest,
  serverReference: ServerReference<T>,
): null | Array<ReactClientValue>

export declare function getServerReferenceLocation<T>(
  config: ClientManifest,
  serverReference: ServerReference<T>,
): void | Error
