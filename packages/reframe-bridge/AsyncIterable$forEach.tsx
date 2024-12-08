import { MaybePromise } from "./types"

/** @deprecated -- @see AsyncIterable$forEach */
export async function AsyncIterable$forEach_old<T>(
  it: AsyncIterable<T>,
  signal: AbortSignal,
  drain: (item: T, index: number, items: typeof it) => MaybePromise<unknown>,
) {
  let index = -1
  for await (const item of it) {
    index++
    if (signal.aborted) return
    await drain(item, index, it)
  }
}

export async function AsyncIterable$forEach<T>(
  them: AsyncIterable<T>,
  forEach: (item: T, index: number, items: typeof them) => MaybePromise<unknown>,
  signal?: AbortSignal,
) {
  let index = -1
  try {
    signal?.throwIfAborted()
    for await (const item of them) {
      signal?.throwIfAborted()
      await forEach(item, index++, them)
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") return
    throw error
  }
}
