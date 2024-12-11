/// <reference types="node" />
import type { Request, ReactClientValue } from "@double-observer/react-server/src/ReactFlightServer"
import type { ClientManifest } from "./ReactFlightServerConfigESMBundler"
import type { ServerManifest } from "@double-observer/react-client/src/ReactFlightClientConfig"
import type { Busboy } from "busboy"
import type { Writable } from "stream"
import type { Thenable } from "../shared/ReactTypes"
import type { TemporaryReferenceSet } from "./ReactFlightServerConfigESMBundler"

export type { TemporaryReferenceSet }

type Options = {
  identifierPrefix?: string
  environmentName?: string | (() => string)
  filterStackFrame?: (url: string, functionName: string) => boolean
  onError?: (error: unknown) => void
  onPostpone?: (reason: string) => void
  temporaryReferences?: TemporaryReferenceSet
}

type PrerenderOptions = {
  identifierPrefix?: string
  environmentName?: string | (() => string)
  filterStackFrame?: (url: string, functionName: string) => boolean
  onError?: (error: unknown) => void
  onPostpone?: (reason: string) => void
  temporaryReferences?: TemporaryReferenceSet
  signal?: AbortSignal
}

type PipeableStream = {
  abort(reason: unknown): void
  pipe<T extends Writable>(destination: T): T
}

type StaticResult = {
  prelude: Readable
}

export declare function renderToPipeableStream(
  model: ReactClientValue,
  moduleBasePath: ClientManifest,
  options?: Options,
): PipeableStream

export declare function prerenderToNodeStream(
  model: ReactClientValue,
  moduleBasePath: ClientManifest,
  options?: PrerenderOptions,
): Promise<StaticResult>

export declare function decodeReplyFromBusboy<T>(
  busboyStream: Busboy,
  moduleBasePath: ServerManifest,
  options?: { temporaryReferences?: TemporaryReferenceSet },
): Thenable<T>

export declare function decodeReply<T>(
  body: string | FormData,
  moduleBasePath: ServerManifest,
  options?: { temporaryReferences?: TemporaryReferenceSet },
): Thenable<T>

export declare function decodeAction<T>(body: FormData, serverManifest: ServerManifest): null | Promise<T>

export declare function decodeFormState<T, V, A extends (...args: any[]) => any>(
  actionResult: T,
  body: FormData,
  serverManifest: ServerManifest,
): null | Promise<[T, string, string, number]>

export {
  registerClientReference,
  registerServerReference,
  createTemporaryReferenceSet,
} from "./ReactFlightESMReferences"
