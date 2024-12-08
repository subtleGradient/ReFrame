"use client"

import React, { Children, ReactElement, ReactNode } from "react"
import { useDeferredValue, useEffect, useState } from "react"
import { AsyncIterable$forEach_old } from "./AsyncIterable$forEach"

interface StreamingFragmentProps {
  initial?: ReactElement
  children: AsyncIterable<ReactElement | { replace: ReactNode }>
}

export function StreamingFragment(props: StreamingFragmentProps) {
  const stream = Children.only(props.children)
  const [children, setChildren] = useState<ReactNode[]>([])

  useEffect(() => setChildren([props.initial]), [props.initial])

  useEffect(() => {
    const control = new AbortController()
    AsyncIterable$forEach_old(stream, control.signal, (child) => {
      if (control.signal.aborted) return
      if ("replace" in child) return setChildren([child.replace])
      setChildren((children) => [...children, child])
    })
    return () => control.abort()
  }, [stream])

  return <>{useDeferredValue(children)}</>
}
