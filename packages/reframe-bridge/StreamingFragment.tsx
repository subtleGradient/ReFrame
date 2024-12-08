import React, { Fragment, ReactElement, ReactNode, useRef } from "react"
import { useDeferredValue, useEffect, useState } from "react"
import { AsyncIterable$forEach } from "./AsyncIterable$forEach"
import invariant from "invariant"

interface StreamingFragmentProps {
  initial?: ReactElement
  final?: ReactElement
  children: AsyncIterable<ReactElement | { replace: ReactNode }>
}

const INITIAL = <Fragment key="INITIAL" />

function useStreamingChildren(
  stream: AsyncIterable<ReactElement | { replace: ReactNode }>,
  initial?: ReactElement,
  final?: ReactElement,
) {
  const [children, setChildren] = useState<ReactNode[]>([INITIAL])
  const finalRef = useRef(final)
  finalRef.current = final

  useEffect(() => {
    const mounted = new AbortController()
    void AsyncIterable$forEach(
      stream,
      (child) => {
        if ("replace" in child) return setChildren([child.replace])
        setChildren((children) => [...children, child])
      },
      mounted.signal,
    ).then(
      function onDone() {
        if (finalRef.current) setChildren(() => [finalRef.current])
      },
      function onError(error) {
        if (mounted.signal.aborted) return
        // bubble up to the error boundary
        setChildren(() => {
          throw error
        })
      },
    )
    return () => mounted.abort()
  }, [stream])

  return !initial ? children : children.map((item) => (item === INITIAL ? initial : item))
}

export function StreamingFragment(props: StreamingFragmentProps) {
  invariant(
    props.children && typeof props.children === "object" && Symbol.asyncIterator in props.children,
    "StreamingFragment children must be an async iterable",
  )

  const children = useStreamingChildren(props.children, props.initial, props.final)

  return <>{useDeferredValue(children)}</>
}
