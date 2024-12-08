import React from "react"
import { useDeferredValue, useEffect, useState } from "react"
import { AsyncIterable$forEach } from "./AsyncIterable$forEach"

export function StreamingFragment({
  initialChildren,
  children: childStream,
}: {
  initialChildren?: React.ReactElement
  children: AsyncIterable<
    | React.ReactElement //
    | { append?: undefined; replace: React.ReactNode }
    | { replace?: undefined; append: React.ReactNode }
  >
}) {
  const [children, setChildren] = useState<React.ReactNode[]>([])

  useEffect(() => setChildren([initialChildren]), [initialChildren])

  useEffect(() => {
    const control = new AbortController()
    AsyncIterable$forEach(childStream, control.signal, (child) => {
      if ("replace" in child) return setChildren([child.replace])
      if ("append" in child) return setChildren((children) => [...children, child.append])
      setChildren((children) => [...children, child])
    })
    return () => control.abort()
  }, [childStream])

  return <>{useDeferredValue(Object.values(children))}</>
}
