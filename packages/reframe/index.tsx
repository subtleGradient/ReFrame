"use client"
export { StreamingFragment } from "./components/StreamingFragment.client"

import { ReactNode } from "react"

export const ReactServerDOMServer = {
  render(render: () => ReactNode): AsyncIterable<string> {
    throw new Error("Not implemented")
  },
}

export function Text(props: { children?: ReactNode }) {
  return <div>Text</div>
}
export function View(props: { children?: ReactNode }) {
  return <div>View</div>
}
export function LinearGradient(props: { children?: ReactNode }) {
  return <div>LinearGradient</div>
}
export function ScrollView(props: { children?: ReactNode }) {
  return <div>ScrollView</div>
}
export function Image(props: { children?: ReactNode }) {
  return <div>Image</div>
}
export function Button(props: { children?: ReactNode }) {
  return <div>Button</div>
}
export function AnimatedButton(props: { children?: ReactNode }) {
  return <div>AnimatedButton</div>
}
export function Switch(props: { children?: ReactNode }) {
  return <div>Switch</div>
}
export function Pressable(props: { children?: ReactNode }) {
  return <div>Pressable</div>
}
export function TextInput(props: { children?: ReactNode }) {
  return <div>TextInput</div>
}
export function ProfileImageView(props: { children?: ReactNode }) {
  return <div>ProfileImageView</div>
}
export function TouchableHighlight(props: { children?: ReactNode }) {
  return <div>TouchableHighlight</div>
}
export function TouchableOpacity(props: { children?: ReactNode }) {
  return <div>TouchableOpacity</div>
}
export function TouchableWithoutFeedback(props: { children?: ReactNode }) {
  return <div>TouchableWithoutFeedback</div>
}
export function SafeAreaView(props: { children?: ReactNode }) {
  return <div>SafeAreaView</div>
}
export function ConsoleLog(props: { children?: ReactNode }) {
  return <div>ConsoleLog</div>
}
export function ReFrame_refreshAt(props: { children?: ReactNode }) {
  return <div>ReFrame_refreshAt</div>
}
export function ReFrameStreaming(props: { children?: ReactNode }) {
  return <div>ReFrameStreaming</div>
}
export function BlurView(props: { children?: ReactNode }) {
  return <div>BlurView</div>
}

export const ui = {
  Text,
  View,
  LinearGradient,
  ScrollView,
  Image,
  Button,
  AnimatedButton,
  Switch,
  Pressable,
  TextInput,
  ProfileImageView,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  ConsoleLog,
  ReFrame_refreshAt,
  ReFrameStreaming,
  BlurView,
} as const
