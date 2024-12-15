export type FIXME<excuse extends any> = any

import type * as flight from "@double-observer/react-client/flight"
import { FindSourceMapURLCallback } from "@double-observer/react-client/src/ReactFlightClient"

export type IReactFlightClient<C extends ReactFlightClientConfig> = flight.default<C>

import type {
  ModuleLoading,
  ReactFlightClientConfig,
  ServerManifest,
  SSRModuleMap,
} from "@double-observer/react-client/src/ReactFlightClientConfig"
import { CallServerCallback, EncodeFormActionCallback } from "@double-observer/react-client/src/ReactFlightReplyClient"
import { TemporaryReferenceSet } from "@double-observer/react-client/src/ReactFlightTemporaryReferences"

export type MaybePromise<T> = T | Promise<T>

export type YieldValue<T> = T extends AsyncIterable<infer U> ? U : never

export type Chunk = Uint8Array | string

export type RSCSource =
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

export type RenderQ =
  | React.ReactElement //
  | { replace: React.ReactElement }
