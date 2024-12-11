import { ClientManifest } from "./shared"
import ReactFlightServerConfig from "./src/ReactFlightServerConfig"
import { HintCode, HintModel } from "./src/Hints"

type FlightRequest = unknown

export type RequestOptions = {
  onError?: (error: unknown) => string | undefined | null
  onPostpone?: (reason: string) => void
  identifierPrefix?: string
  environmentName?: string | (() => string)
  // DEV only
  filterStackFrame?: (url: string, functionName: string) => boolean
}

export class FlightRequestHandler<
  Destination,
  Chunk,
  PrecomputedChunk,
  C extends ReactFlightServerConfig<Destination, Chunk, PrecomputedChunk>,
> {
  constructor(config: C)
  abort(request: FlightRequest, reason: any): void
  createPrerenderRequest(model: any, bundlerConfig: ClientManifest, options?: RequestOptions): FlightRequest
  createRequest(model: any, bundlerConfig: ClientManifest, options?: RequestOptions): FlightRequest
  emitHint<Code extends HintCode>(request: FlightRequest, code: Code, model: HintModel<Code>): void
  getCache(request: FlightRequest): Map<Function, unknown>
  getHints(request: FlightRequest): unknown
  resolveRequest(): FlightRequest | null
  startFlowing(request: FlightRequest, destination: any): void
  startWork(request: FlightRequest): void
  stopFlowing(request: FlightRequest): void
}
