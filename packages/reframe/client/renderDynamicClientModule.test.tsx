import { expect, test, describe } from "bun:test"
import { renderDynamicClientModule } from "./renderDynamicClientModule"
import React, { ReactElement } from "react"

describe("renderDynamicClientModule", () => {
  test("should render a JSX element to RSC", () => {
    const Div = () => null
    Div.displayName = "div"
    const element = <Div />

    const result = ['1:I["ReFrameDynamic",[],"div"]\n', '0:["$","$L1",null,{},null]\n']

    const renderer = renderDynamicClientModule(element)
    const output = Array.from(renderer)
    expect(output).toEqual(result)
  })

  test("should use displayName over name", () => {
    const CustomComponent = () => null
    CustomComponent.displayName = "DisplayName"

    const element = <CustomComponent />

    const renderer = renderDynamicClientModule(element)
    const output = Array.from(renderer)

    expect(output[0]).toContain("DisplayName")
  })

  test("should throw if no name available", () => {
    // Create anonymous function component
    const element: ReactElement = { type: null as any, props: {}, key: null }

    expect(() => {
      Array.from(renderDynamicClientModule(element))
    }).toThrow("element must have a name")
  })

  test("should throw if element has children", () => {
    function Parent({ children }: { children: React.ReactNode }) {
      return null
    }
    function Child() {
      return null
    }

    const element = (
      <Parent>
        <Child />
      </Parent>
    )

    expect(() => {
      Array.from(renderDynamicClientModule(element)).join("")
    }).toThrow(/children not supported/)
  })

  test("should throw if prop contains Promise", () => {
    const Component = ({ promise }: { promise: Promise<unknown> }) => null
    Component.displayName = "Component"

    const element = <Component promise={Promise.resolve()} />

    expect(() => {
      Array.from(renderDynamicClientModule(element)).join("")
    }).toThrow("Promise values are not supported")
  })

  test("should throw if prop contains function", () => {
    const Component = ({ onClick }: { onClick: () => void }) => null
    Component.displayName = "Component"

    const element = <Component onClick={() => {}} />

    expect(() => {
      const output = Array.from(renderDynamicClientModule(element)).join("")
      JSON.parse(output.split("\n")[1].split(":")[1]) // Parse the props object
    }).toThrow("function values are not supported")
  })
})
