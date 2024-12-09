import invariant from "invariant"
import {
  ClientModuleExportName,
  ClientReferenceMetadata,
  DependencyChunks,
  ModuleID,
} from "react-client/src/ReactFlightClientConfig"

export function* renderDynamicClientModule(
  element: React.ReactElement & { type: string | { name: string; displayName?: string } },
) {
  invariant(!element.props?.children, "children not supported in renderDynamicClientModule yet")

  const moduleId: ModuleID = "ReFrameDynamic"
  const deps: DependencyChunks = []
  const name: ClientModuleExportName =
    typeof element.type === "string" ?
      element.type
    : (element.type?.displayName ?? element.type?.name ?? element.type)

  invariant(name, "renderDynamicClientModule: element must have a name")

  const id: number = 1
  yield stringified`${id}:I${[moduleId, deps, name] satisfies ClientReferenceMetadata}\n`
  yield stringified`0:${["$", `$L${id}`, element.key, element.props, null]}\n`
}

function replacer(key: string, value: any) {
  if (value instanceof Promise)
    throw new Error(`Promise values are not supported yet. Got promise for ${key}`)
  if (typeof value === "function")
    throw new Error(`function values are not supported yet. Got function for ${key}`)
  return value
}

function stringified(strings: TemplateStringsArray, ...valueSubstitutions: any[]) {
  return strings.reduce(
    (output, stringPart, index) =>
      output +
      stringPart +
      (index in valueSubstitutions ? JSON.stringify(valueSubstitutions[index], replacer) : ""),
    "",
  )
}
