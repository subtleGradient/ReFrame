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
