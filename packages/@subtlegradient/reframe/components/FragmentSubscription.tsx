import { ReactElement } from "react"
import { MaybePromise, RenderQ } from "../random/types"
import { AsyncQueue } from "../random/AsyncQueue"
import { AsyncIterable$forEach } from "../random/AsyncIterable$forEach"
import { StreamingFragment } from "./StreamingFragment.client"
import React from "react"

export function FragmentSubscription<T>({
  signal,
  subscriptions,
  fallback,
  render,
}: {
  signal: AbortSignal
  subscriptions: AsyncIterable<T>[]
  fallback?: ReactElement
  render: (payload: T | null) => MaybePromise<ReactElement | undefined>
}) {
  "use server"
  const renderQ = new AsyncQueue<RenderQ>(signal)
  if (fallback) renderQ.push(fallback)

  void refresh(null) // initial load

  subscriptions.forEach((sub) => AsyncIterable$forEach(sub, refresh, signal))

  async function refresh(payload: T | null) {
    const children = await render(payload)
    if (!children) return
    renderQ.push({ replace: children })
  }

  return <StreamingFragment>{renderQ}</StreamingFragment>
}
