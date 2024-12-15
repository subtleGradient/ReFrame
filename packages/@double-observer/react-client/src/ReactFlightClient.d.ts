import type {
  ModuleLoading,
  ReactFlightClientConfig,
  ServerManifest,
  SSRModuleMap,
} from "./src/ReactFlightClientConfig"
import type { CallServerCallback, EncodeFormActionCallback } from "./src/ReactFlightReplyClient"
import type { TemporaryReferenceSet } from "./src/ReactFlightTemporaryReferences"
import type { Thenable } from "./shared/ReactTypes"

export interface FlightResponse<C extends ReactFlightClientConfig = ReactFlightClientConfig> {
  _bundlerConfig: SSRModuleMap
  _serverReferenceConfig: ServerManifest | null
  _moduleLoading: ModuleLoading
  _callServer: CallServerCallback
  _encodeFormAction: void | EncodeFormActionCallback
  _nonce: string | void
  _chunks: Map<number, any>
  _fromJSON: (key: string, value: any) => any
  _stringDecoder: any
  _rowState: number
  _rowID: number
  _rowTag: number
  _rowLength: number
  _buffer: Array<Uint8Array>
  _tempRefs: TemporaryReferenceSet | void
  _debugRootOwner: any
  _debugRootStack: Error | null
  _debugFindSourceMapURL?: FindSourceMapURLCallback | void
  _replayConsole: boolean
  _rootEnvironmentName: string
}

export type FindSourceMapURLCallback = (fileName: string, environmentName: string) => string | null

export default class ReactFlightClient<C extends ReactFlightClientConfig> {
  constructor(config: C)

  close: (response: FlightResponse<C>) => void

  createResponse(
    bundlerConfig: SSRModuleMap | null,
    serverReferenceConfig: ServerManifest | null,
    moduleLoading: ModuleLoading,
    callServer?: CallServerCallback | void,
    encodeFormAction?: EncodeFormActionCallback | void,
    nonce?: string | void,
    temporaryReferences?: TemporaryReferenceSet | void,
    findSourceMapURL?: FindSourceMapURLCallback | void,
    replayConsole?: boolean,
    environmentName?: string,
  ): FlightResponse<C>

  getRoot: <T>(response: FlightResponse<C>) => Thenable<T>

  processBinaryChunk: (response: FlightResponse<C>, chunk: Uint8Array) => void

  processStringChunk: (response: FlightResponse<C>, chunk: string) => void

  reportGlobalError: (response: FlightResponse<C>, error: Error) => void

  injectIntoDevTools: () => boolean
}
