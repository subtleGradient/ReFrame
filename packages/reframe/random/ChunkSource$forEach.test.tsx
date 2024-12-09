import { expect, test } from "bun:test"

import { ChunkSource$forEach } from "./Chunk$forEach"
import { Chunk } from "./types"

test("handles string chunks", async () => {
  const chunks: Chunk[] = []
  await ChunkSource$forEach("test", (chunk) => {
    chunks.push(chunk)
  })
  expect(chunks).toEqual(["test"])
})

test("handles Uint8Array chunks", async () => {
  const chunks: Uint8Array[] = []
  const sourceChunk = new Uint8Array([1, 2, 3])
  await ChunkSource$forEach(sourceChunk, (chunk) => {
    chunks.push(chunk as Uint8Array)
  })
  expect(chunks).toEqual([sourceChunk])
})

test("handles sync iterables", async () => {
  const chunks: Chunk[] = []
  const source = ["a", "b", "c"]
  await ChunkSource$forEach(source, (chunk) => {
    chunks.push(chunk)
  })
  expect(chunks).toEqual(["a", "b", "c"])
})

test("handles async iterables", async () => {
  const chunks: Chunk[] = []
  const source = {
    async *[Symbol.asyncIterator]() {
      yield "a"
      yield "b"
      yield "c"
    },
  }
  await ChunkSource$forEach(source, (chunk) => {
    chunks.push(chunk)
  })
  expect(chunks).toEqual(["a", "b", "c"])
})

test("handles iterators", async () => {
  const chunks: Chunk[] = []
  const source = {
    next: (() => {
      let i = 0
      const values = ["a", "b", "c"]
      return () => {
        if (i >= values.length) {
          return { done: true, value: undefined }
        }
        return { done: false, value: values[i++] }
      }
    })(),
  }
  // @ts-expect-error testing imperfect input
  await ChunkSource$forEach(source, (chunk) => {
    chunks.push(chunk)
  })
  expect(chunks).toEqual(["a", "b", "c"])
})

test("handles async iterators", async () => {
  const chunks: Chunk[] = []
  const source = {
    next: (() => {
      let i = 0
      const values = ["a", "b", "c"]
      return async () => {
        if (i >= values.length) {
          return { done: true, value: undefined }
        }
        return { done: false, value: values[i++] }
      }
    })(),
  }
  // @ts-expect-error testing imperfect input
  await ChunkSource$forEach(source, (chunk) => {
    chunks.push(chunk)
  })
  expect(chunks).toEqual(["a", "b", "c"])
})

test("aborts when signal is triggered", async () => {
  const chunks: Chunk[] = []
  const controller = new AbortController()
  const source = {
    async *[Symbol.asyncIterator]() {
      yield "a"
      controller.abort()
      yield "b"
      yield "c"
    },
  }

  await ChunkSource$forEach(
    source,
    (chunk) => {
      chunks.push(chunk)
    },
    controller.signal,
  )

  expect(chunks).toEqual(["a"])
})

test("throws for invalid chunk values in iterable", async () => {
  const source = [1, 2, 3] // numbers are not valid chunks
  // @ts-expect-error testing invalid input
  expect(ChunkSource$forEach(source, () => {})).rejects.toThrow()
})

test("throws for null source", async () => {
  // @ts-expect-error testing invalid input
  expect(ChunkSource$forEach(null, () => {})).rejects.toThrow()
})

test("throws for undefined source", async () => {
  // @ts-expect-error testing invalid input
  expect(ChunkSource$forEach(undefined, () => {})).rejects.toThrow()
})

test("throws for non-object source", async () => {
  // @ts-expect-error testing invalid input
  expect(ChunkSource$forEach(123, () => {})).rejects.toThrow()
})

test("provides correct indices", async () => {
  const indices: number[] = []
  await ChunkSource$forEach(["a", "b", "c"], (_, index) => {
    indices.push(index)
  })
  expect(indices).toEqual([0, 1, 2])
})

test("provides source reference", async () => {
  const source = ["a", "b", "c"]
  let providedSource: any
  await ChunkSource$forEach(source, (_, __, src) => {
    providedSource = src
  })
  expect(providedSource).toBe(source)
})

test("handles async forEach callback", async () => {
  const chunks: Chunk[] = []
  const delays: number[] = [100, 50, 25]
  await ChunkSource$forEach(["a", "b", "c"], async (chunk, index) => {
    await new Promise((resolve) => setTimeout(resolve, delays[index]))
    chunks.push(chunk)
  })
  expect(chunks).toEqual(["a", "b", "c"])
})
