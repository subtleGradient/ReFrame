// packages/react-server-dom-esm/src/client/ReactFlightDOMClient.d.ts
import type { Thenable } from "../shared/ReactTypes"

import type {
  Response as FlightResponse,
  FindSourceMapURLCallback,
} from "@double-observer/react-client/src/ReactFlightClient"

import type { ReactServerValue } from "@double-observer/react-client/src/ReactFlightReplyClient"
import type { TemporaryReferenceSet } from "@double-observer/react-client/src/ReactFlightTemporaryReferences"

type CallServerCallback = <A, T>(id: string, args: A) => Promise<T>

export type Options = {
  moduleBaseURL?: string
  callServer?: CallServerCallback
  temporaryReferences?: TemporaryReferenceSet
  findSourceMapURL?: FindSourceMapURLCallback
  replayConsoleLogs?: boolean
  environmentName?: string
}

export declare function createFromReadableStream<T>(stream: ReadableStream, options?: Options): Thenable<T>
export declare function createFromFetch<T>(promiseForResponse: Promise<Response>, options?: Options): Thenable<T>
export declare function createServerReference<A extends Iterable<any>, T>(
  id: any,
  callServer: any,
): (...args: A) => Promise<T>
export declare function createTemporaryReferenceSet(): TemporaryReferenceSet
export declare function encodeReply(
  value: ReactServerValue,
  options?: { temporaryReferences?: TemporaryReferenceSet; signal?: AbortSignal },
): Promise<string | URLSearchParams | FormData>
