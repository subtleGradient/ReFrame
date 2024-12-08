"use client"

import React, { ReactElement, ReactNode } from "react"
import { useDeferredValue, useEffect, useState } from "react"
import { AsyncIterable$forEach } from "./AsyncIterable$forEach"

interface StreamingFragmentProps {
  initialChildren?: ReactElement
  children: AsyncIterable<ReactElement | { replace: ReactNode }>
}

export function StreamingFragment({ initialChildren, children: stream }: StreamingFragmentProps) {
  const [children, setChildren] = useState<ReactNode[]>([])

  useEffect(() => setChildren([initialChildren]), [initialChildren])

  useEffect(() => {
    const control = new AbortController()
    AsyncIterable$forEach(stream, control.signal, (child) => {
      if (control.signal.aborted) return
      if ("replace" in child) return setChildren([child.replace])
      setChildren((children) => [...children, child])
    })
    return () => control.abort()
  }, [stream])

  return <>{useDeferredValue(children)}</>
}
