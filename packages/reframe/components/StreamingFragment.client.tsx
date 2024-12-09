import invariant from "invariant"
import React, {
  Fragment,
  ReactElement,
  ReactNode,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from "react"
import { AsyncIterable$forEach } from "../random/AsyncIterable$forEach"

interface StreamingFragmentProps {
  initial?: ReactElement
  final?: ReactElement
  children: boolean | null | undefined | AsyncIterable<ReactElement | { replace: ReactNode }>
}

function useStreamingChildren(
  stream: StreamingFragmentProps["children"],
  initial?: ReactElement,
  final?: ReactElement,
) {
  const [children, setChildren] = useState<ReactNode>(initial)
  const finalRef = useRef(final)
  finalRef.current = final

  useEffect(() => {
    if (!stream || stream === true) return
    invariant(
      stream && typeof stream === "object" && Symbol.asyncIterator in stream,
      "StreamingFragment children must be an async iterable",
    )
    const mounted = new AbortController()
    void AsyncIterable$forEach(
      stream,
      (child) => {
        if ("replace" in child) return setChildren(child.replace)
        setChildren((children) =>
          [
            children,
            child.key ? child : (
              <Fragment key={Array.isArray(children) ? children.length : 1}>{child}</Fragment>
            ),
          ].flat(),
        )
      },
      mounted.signal,
    ).then(
      function onDone() {
        if (finalRef.current) setChildren(finalRef.current)
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

  return children
}

export function StreamingFragment(props: StreamingFragmentProps) {
  const children = useStreamingChildren(props.children, props.initial, props.final)
  return useDeferredValue(children)
}
