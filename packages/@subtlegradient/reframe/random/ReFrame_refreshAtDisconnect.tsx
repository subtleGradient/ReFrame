// server will send a heartbeat every
const HEARTBEAT_INTERVAL = 10_000 // ms
// client will consider the server dead after no communication for
const CONSIDERED_DEAD_AFTER = 30_000 // ms

/**
 * dead man switch
 * if the client doesn't hear from the server in 30 seconds,
 * it has standing orders to refresh the view (if it's still mounted)
 */
export function ReFrame_refreshAtDisconnect({ signal }: { signal: AbortSignal }) {
  return (
    <FragmentSubscription
      signal={signal}
      subscriptions={[
        {
          [Symbol.asyncIterator]: () => ({
            async next() {
              await new Promise((wake) => setTimeout(wake, HEARTBEAT_INTERVAL))
              return { value: Date.now(), done: false }
            },
          }),
        },
      ]}
      render={(now) => <ReFrame_refreshAt timestamp={(now ?? Date.now()) + CONSIDERED_DEAD_AFTER} />}
    />
  )
}

export function DeadManSwitch_server({
  signal,
  ...props
}: {
  signal: AbortSignal
  live?: ReactNode
  sickDelay?: EpochTimeStamp
  sick?: ReactNode
  deadDelay: EpochTimeStamp
  dead: ReactNode
}) {
  return (
    <FragmentSubscription
      signal={signal}
      subscriptions={[
        {
          [Symbol.asyncIterator]: () => ({
            async next() {
              await new Promise((wake) => setTimeout(wake, HEARTBEAT_INTERVAL))
              return { value: Date.now(), done: false }
            },
          }),
        },
      ]}
      render={(now) =>
        !now ? undefined : (
          <DeadManSwitch
            live={props.live}
            sickline={!props.sickDelay ? undefined : now + props.sickDelay}
            sick={props.sick}
            deadline={now + props.deadDelay}
            dead={props.dead}
          />
        )
      }
    />
  )
}
