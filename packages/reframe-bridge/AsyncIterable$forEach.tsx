import { MaybePromise } from "./types"

export async function AsyncIterable$forEach<T>(
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
