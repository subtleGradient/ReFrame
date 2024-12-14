"use client"
import { ReactNode, useEffect, useState } from "react"

/**
 * conditionally render different content based on the current time relative to provided deadlines.
 *
 * The idea is that the server can declare a window of time in which certain contentt should be shown.
 * The server will keep streaming updates to the deadline, pushing it further into the future.
 * If the server goes silent for too long, for any reason, the client will switch to a different content as defined by the server.
 *
 * @param props - The properties for the DeadManSwitch component.
 * @param props.live - The content to render when the current time is before the sickline.
 * @param props.sickline - The timestamp when the content should switch from live to sick.
 * @param props.sick - The content to render when the current time is between the sickline and the deadline.
 * @param props.deadline - The timestamp when the content should switch from sick to dead.
 * @param props.dead - The content to render when the current time is after the deadline.
 *
 * @returns The appropriate content based on the current time.
 */
export function DeadManSwitch(props: {
  live?: ReactNode
  sickline?: EpochTimeStamp
  sick?: ReactNode
  deadline: EpochTimeStamp
  dead: ReactNode
}) {
  const [, forceRerender] = useState(0)
  const { deadline, sickline = deadline, dead, sick = dead, live = null } = props

  useEffect(() => {
    const soonest = Math.min(sickline, deadline)
    const timeout = setTimeout(() => forceRerender((id) => id + 1), Math.max(0, soonest - now))
    return () => clearTimeout(timeout)
  }, [sickline, deadline])

  const now = Date.now()
  if (now < sickline) return live
  if (now < deadline) return sick
  return dead
}
