import { ThemedText } from "@/components/ThemedText"
import { StreamingFragment } from "@sublegradient/reframe-bridge/StreamingFragment"
import { fetch } from "expo/fetch"
import React from "react"
import { ScrollView } from "react-native"

export default function HomeScreen() {
  return (
    <ScrollView style={{ padding: 16 }}>
      <ThemedText style={{ fontSize: 24 }}>Streaming text demo (replace)</ThemedText>
      <ThemedText style={{ fontSize: 14 }}>real streaming and chunked rendering</ThemedText>
      <ThemedText>
        <StreamingFragment initial={<ThemedText>loading...</ThemedText>}>
          {renderChunkedTimestamps}
        </StreamingFragment>
      </ThemedText>

      <ThemedText style={{ fontSize: 24 }}>Streaming text demo (append)</ThemedText>
      <ThemedText style={{ fontSize: 14 }}>fake streaming, but real chunked rendering</ThemedText>
      <ThemedText>
        <StreamingFragment initial={<ThemedText>loading...</ThemedText>}>
          {renderChunked}
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
