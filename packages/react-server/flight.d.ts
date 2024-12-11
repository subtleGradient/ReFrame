import { HintCode, HintModel } from "./Hints"
import ReactFlightServerConfig from "./ReactFlightServerConfig"
import { ClientManifest } from "./shared"

type FlightRequest = unknown

export type RequestOptions = {
  onError?: (error: unknown) => string | undefined | null
  onPostpone?: (reason: string) => void
  identifierPrefix?: string
  environmentName?: string | (() => string)
  // DEV only
  filterStackFrame?: (url: string, functionName: string) => boolean
}

export class FlightRequestHandler<C extends ReactFlightServerConfig> {
  constructor(config: C)
  abort(request: FlightRequest, reason: any): void
  createPrerenderRequest(
    model: any,
    bundlerConfig: ClientManifest,
    options?: RequestOptions,
  ): FlightRequest
  createRequest(model: any, bundlerConfig: ClientManifest, options?: RequestOptions): FlightRequest
  emitHint<Code extends HintCode>(request: FlightRequest, code: Code, model: HintModel<Code>): void
  getCache(request: FlightRequest): Map<Function, unknown>
  getHints(request: FlightRequest): unknown
  resolveRequest(): FlightRequest | null
  startFlowing(request: FlightRequest, destination: any): void
  startWork(request: FlightRequest): void
  stopFlowing(request: FlightRequest): void
}
