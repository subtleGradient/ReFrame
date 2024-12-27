import React, { Suspense } from "react"
import { ServerPageProps } from "../rsc"
import { registerServerReference } from "@subtlegradient/reframe/server"

/**
 * max-age
 * don't ask for new data until this many seconds have passed
 * if the client has a copy of this that is less than 60 seconds old, they should not ask for a new one
 */
const maxAge_sec = 60

/**
 * stale-while-revalidate
 * client can use this response for up to this many seconds
 * if the client happens to have an old stale copy of this, it can use it for up to 1 day, after that they gotta throw it away
 */
const staleWhileRevalidate_sec = 1 * 24 * 60 * 60

export default function Hello({ setHeader }: ServerPageProps) {
  // setHeader("Cache-Control", `public, max-age=${maxAge_sec}, stale-while-revalidate=${staleWhileRevalidate_sec}`)

  // const startedAt: EpochTimeStamp = Date.now()
  // const cacheAt: EpochTimeStamp = Date.now()
  // const revalidateAt: EpochTimeStamp = cacheAt + staleWhileRevalidate_sec * 1000
  // const expireAt: EpochTimeStamp = cacheAt + maxAge_sec * 1000

  return (
    <>
      <h1>Hello, World!</h1>

      <Suspense fallback={<div>loading...</div>}>
        <HelloMessage delay={1_000} />
      </Suspense>

      <Suspense fallback={<div>loading...</div>}>
        <HelloMessage delay={2_000} />
      </Suspense>

      <Suspense fallback={<div>loading...</div>}>
        <HelloMessage delay={3_000} />
      </Suspense>

      <Suspense fallback={<div>loading...</div>}>
        <HelloMessage delay={4_000} />
      </Suspense>

      <Suspense fallback={<div>loading...</div>}>
        <HelloMessage delay={5_000} />
      </Suspense>
    </>
  )
}

export const HelloMessage$onClick = registerServerReference(
  function HelloMessage$onClick(props: { delay: number }, event: unknown) {
    "use server"
    console.log("HelloMessage$onClick", props.delay, event)
  },
  import.meta.url.split("/src/")[1],
  "HelloMessage$onClick",
)

export async function HelloMessage(props: { delay: number }) {
  await new Promise((wake) => setTimeout(wake, props.delay))
  return (
    <div onClick={HelloMessage$onClick.bind(null, props)} style={{ color: "white" }}>
      Hello, World! (after {props.delay}ms)
    </div>
  )
}
