import invariant from "invariant"
import type { MaybePromise, Chunk, ChunkSource, YieldValue } from "./types"

interface ChunkForEach<S extends ChunkSource> {
  (chunk: Chunk, index: number, source: S): MaybePromise<unknown>
}

export async function ChunkSource$forEach<S extends ChunkSource>(
  source: S,
  forEach: ChunkForEach<S>,
  signal?: AbortSignal,
) {
  let index = -1
  try {
    if (signal) throwIfAborted(signal)
    invariant(source != null, "ChunkSource$forEach: Source must be defined")

    // Handle single chunk value
    if (isChunk(source)) {
      await forEach(source, -1, source)
      return
    }

    invariant(typeof source === "object", "ChunkSource$forEach: Source must be an object")

    // Handle sync Iterable
    if (isIterable(source)) {
      for (const chunk of source) {
        if (signal) throwIfAborted(signal)
        invariant(isChunk(chunk), "ChunkSource$forEach: Iterable must yield chunk values")
        await forEach(chunk, ++index, source)
      }
      return
    }

    // Handle AsyncIterable/AsyncGenerator
    if (isAsyncIterable(source)) {
      for await (const chunk of source) {
        if (signal) throwIfAborted(signal)
        invariant(isChunk(chunk), "ChunkSource$forEach: AsyncIterable must yield chunk values")
        await forEach(chunk, ++index, source)
      }
      return
    }

    // Handle Iterator
    if (isIterator(source)) {
      return ChunkSource$forEach(
        { [Symbol.asyncIterator]: () => source } satisfies AsyncIterable<Chunk>,
        (item, index) => forEach(item, index, source),
        signal,
      )
    }

    invariant(
      !(source satisfies never),
      "ChunkSource$forEach: Source must be an Iterable or AsyncIterable",
    )
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") return
    throw error
  }
}

function isChunk(source: unknown): source is Chunk {
  return typeof source === "string" || source instanceof Uint8Array
}

function isAsyncIterable(source: unknown): source is AsyncIterable<unknown, any, any> {
  if (typeof source !== "object" || source === null) return false
  return typeof (source as any)[Symbol.asyncIterator] === "function"
}

function isIterable(source: unknown): source is Iterable<unknown> {
  if (typeof source !== "object" || source === null) return false
  return typeof (source as any)[Symbol.iterator] === "function"
}

function isIterator(source: unknown): source is Iterator<unknown> | AsyncIterator<unknown> {
  if (typeof source !== "object" || source === null) return false
  return "next" in source && typeof (source as any).next === "function"
}

class AbortError extends Error {
  name = "AbortError"
}

function throwIfAborted(signal: AbortSignal) {
  if (signal?.throwIfAborted) signal.throwIfAborted()
  else if (signal.aborted) throw new AbortError("Aborted")
}
