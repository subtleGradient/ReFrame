import "@double-observer/react-client"

import ReactFlightClient, { FindSourceMapURLCallback } from "react-client/flight"
import type {
  ModuleLoading,
  ServerManifest,
  SSRModuleMap,
} from "react-client/src/ReactFlightClientConfig"
import {
  CallServerCallback,
  EncodeFormActionCallback,
} from "react-client/src/ReactFlightReplyClient"
import { TemporaryReferenceSet } from "react-client/src/ReactFlightTemporaryReferences"

export type MaybePromise<T> = T | Promise<T>

export type YieldValue<T> = T extends AsyncIterable<infer U> ? U : never

export type Chunk = Uint8Array | string

export type ChunkSource =
  | Chunk
  //
  | Iterable<Chunk>
  | Iterator<Chunk>
  | Generator<Chunk>
  //
  | AsyncIterable<Chunk>
  | AsyncIterator<Chunk>
  | AsyncIteratorObject<Chunk>
  | AsyncGenerator<Chunk>
  //
  | ReadableStream<Chunk>
// | ReadableStream<Chunk>["getReader"]
// | ReadableStreamDefaultReader<Chunk>
// | ReadableStreamReader<Chunk>

export interface FlightResponseProps {
  bundlerConfig: SSRModuleMap | null
  serverReferenceConfig: ServerManifest | null
  moduleLoading: ModuleLoading
  callServer?: CallServerCallback | void
  encodeFormAction?: EncodeFormActionCallback | void
  nonce?: string | void
  temporaryReferences?: TemporaryReferenceSet | void
  findSourceMapURL?: FindSourceMapURLCallback | void
  replayConsole?: boolean
  environmentName?: string
}

export type IReactFlightClient = ReturnType<typeof ReactFlightClient>
