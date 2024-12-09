import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { StreamingFragment } from "@double-observer/reframe"
import { useIsFocused } from "@react-navigation/native"
import { ErrorBoundaryProps } from "expo-router"
import { Try } from "expo-router/build/views/Try"
import { fetch } from "expo/fetch"
import React from "react"
import { Button, ScrollView } from "react-native"

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <ThemedView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ThemedText>Something went wrong: {error?.message ?? "unknown error"}</ThemedText>
      <Button title="Try Again" onPress={retry} />
      <ThemedText>{new Date().toLocaleString()}</ThemedText>
    </ThemedView>
  )
}

export default function HomeScreen() {
  const isFocused = useIsFocused()
  return (
    <ScrollView style={{ padding: 16, marginBottom: 32 }}>
      <ThemedText style={{ fontSize: 24, marginTop: 16 }}>Streaming text demo (replace)</ThemedText>
      <ThemedText style={{ fontSize: 14 }}>real streaming and chunked rendering</ThemedText>
      <ThemedText>
        <Try catch={ErrorBoundary}>
          <StreamingFragment
            initial={<ThemedText>(connecting)</ThemedText>}
            final={<ThemedText>(disconnected)</ThemedText>}
          >
            {isFocused && renderChunkedTimestamps}
          </StreamingFragment>
        </Try>
      </ThemedText>

      <ThemedText style={{ fontSize: 24, marginTop: 16 }}>Streaming text demo (append)</ThemedText>
      <ThemedText style={{ fontSize: 14 }}>fake streaming, but real chunked rendering</ThemedText>
      <ThemedText>
        <StreamingFragment initial={<ThemedText>loading...</ThemedText>}>
          {isFocused && renderChunked}
        </StreamingFragment>
      </ThemedText>
    </ScrollView>
  )
}

const renderChunked = {
  async *[Symbol.asyncIterator]() {
    yield { replace: <ThemedText>loading...</ThemedText> }

    const response = await fetch("https://baconipsum.com/api/?type=meat-and-filler")
    yield { replace: <ThemedText>response: {response.status}</ThemedText> }

    await new Promise((resolve) => setTimeout(resolve, 333))
    const text = await response.text()

    const chunks = text.split(/\b|\["|"]|(",")/)

    let index = -1
    for (const chunk of chunks) {
      index++
      if (chunk === `","`) {
        yield <ThemedText>{"\n\n"}</ThemedText>
        continue
      }
      if (index === 0) yield { replace: null }
      yield <ThemedText>{chunk}</ThemedText>
      await new Promise((resolve) => setTimeout(resolve, 111 * Math.random()))
    }

    yield <ThemedText>{"\n\n"}Done</ThemedText>
  },
}

const renderChunkedTimestamps = {
  async *[Symbol.asyncIterator]() {
    yield { replace: <ThemedText>loading...</ThemedText> }

    const response = await fetch("http://localhost:8000")
    yield { replace: <ThemedText>response: {response.status}</ThemedText> }

    await new Promise((resolve) => setTimeout(resolve, 333))

    const { body } = response

    if (!body) {
      yield <ThemedText>ERROR: no body</ThemedText>
      return
    }
    for await (const chunk of body) {
      const random = Math.random()
      yield {
        replace: (
          <ThemedText
            style={{
              // random background color so it's easier to see that something changed
              backgroundColor: `hsl(${random * 360}, 50%, 50%)`,
              color: "white",
              fontVariant: ["tabular-nums"],
            }}
          >
            {new TextDecoder().decode(chunk).trim()}
          </ThemedText>
        ),
      }
    }

    yield <ThemedText>{"\n\n"}Done</ThemedText>
  },
}
