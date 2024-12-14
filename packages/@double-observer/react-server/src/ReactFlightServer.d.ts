import { ReactElement } from "react"
import { ClientManifest, ClientReference, ReactReference$$id, ServerReference } from "../shared"
import { ReactAsyncInfo, ReactComponentInfo, ReactDebugInfo, Thenable } from "../shared/ReactTypes"
import { HintCode, HintModel } from "./Hints"
import ReactFlightServerConfig from "./ReactFlightServerConfig"
import { LazyComponent } from "../shared/ReactLazy"

export type FlightRequest = unknown
export type Request = FlightRequest

export type RequestOptions = {
  onError?: (error: unknown) => string | undefined | null
  onPostpone?: (reason: string) => void
  identifierPrefix?: string
  environmentName?: string | (() => string)
  // DEV only
  filterStackFrame?: (url: string, functionName: string) => boolean
}

export class ReactFlightServer<
  Destination,
  Chunk,
  PrecomputedChunk,
  C extends ReactFlightServerConfig<Destination, Chunk, PrecomputedChunk>,
> {
  constructor(config: C)
  abort(request: FlightRequest, reason: unknown): void
  createPrerenderRequest(model: unknown, bundlerConfig: ClientManifest, options?: RequestOptions): FlightRequest
  createRequest(model: unknown, bundlerConfig: ClientManifest, options?: RequestOptions): FlightRequest
  emitHint<Code extends HintCode>(request: FlightRequest, code: Code, model: HintModel<Code>): void
  getCache(request: FlightRequest): Map<Function, unknown>
  getHints(request: FlightRequest): unknown
  resolveRequest(): FlightRequest | null
  startFlowing(request: FlightRequest, destination: unknown): void
  startWork(request: FlightRequest): void
  stopFlowing(request: FlightRequest): void
}

// Serializable values
export type ReactClientValue =
  // The subset of values that are preserved by serializing to JSON:
  | string
  | boolean
  | number
  | null
  | void
  | ReadonlyArray<ReactClientValue>
  | { [key: string]: ReactClientValue }
  // | Thenable<ReactClientValue>
  | Iterable<ReactClientValue>
  | Iterator<ReactClientValue>
  | Date // only allowed for best effort but serializes to string
  | ArrayBuffer // also allowed for best effort
  | DataView
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | BigInt64Array
  | BigUint64Array
  | Float32Array
  | Float64Array
  | RegExp // also best effort
  | Map<ReactClientValue, ReactClientValue>
  | Set<ReactClientValue>
  | FormData
  | File // only allowed on the server
  | Blob // only allowed on the server
  | ArrayBufferView // also best effort
  | Error // also best effort
  | Symbol // also best effort
  | bigint // also best effort
  // Non-JSON types on the client are opaque in data but their slot-based
  // mechanism to refer to functions, symbols, elements, etc. are preserved.
  | Promise<ReactClientValue> // Thenable<ReactClientValue>
  | symbol
  | ClientReference<unknown>
  | ServerReference<unknown>
  | ReactElement<string | ClientReference<unknown>, ReactClientValue | { [key: string]: ReactClientValue }>
  | ReactComponentInfo
  | ReactAsyncInfo
  | LazyComponent<unknown, unknown>
  | AsyncIterable<ReactClientValue, ReactClientValue, void>
  | AsyncIterator<ReactClientValue, ReactClientValue, void>
