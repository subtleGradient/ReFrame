import type { FindSourceMapURLCallback, FlightResponse } from "@double-observer/react-client/src/ReactFlightClient"
import type { ReactServerValue } from "@double-observer/react-client/src/ReactFlightReplyClient"
import type { TemporaryReferenceSet } from "@double-observer/react-client/src/ReactFlightTemporaryReferences"
import type { Thenable } from "../shared/ReactTypes"

type CallServerCallback = <A, T>(id: string, args: A) => Promise<T>

export type Options = {
  moduleBaseURL?: string
  callServer?: CallServerCallback
  temporaryReferences?: TemporaryReferenceSet
  findSourceMapURL?: FindSourceMapURLCallback
  replayConsoleLogs?: boolean
  environmentName?: string
}

export default class ReactFlightDOMClient {
  static createFromReadableStream<T>(stream: ReadableStream, options?: Options): Thenable<T>

  static createFromFetch<T>(promiseForResponse: Promise<FlightResponse>, options?: Options): Thenable<T>

  static createServerReference<A extends Iterable<any>, T>(id: any, callServer: any): (args: A) => Promise<T>

  static createTemporaryReferenceSet(): TemporaryReferenceSet

  static encodeReply(
    value: ReactServerValue,
    options?: { temporaryReferences?: TemporaryReferenceSet; signal?: AbortSignal },
  ): Promise<string | URLSearchParams | FormData>
}
