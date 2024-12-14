Decisions

- nix is recommended for development, but not required

# Work in progress

- [x] react-client build for React 18
- [x] bunp react-client build for React 19 (without breaking support for React 18)
- [x] publish @double-observer/react-client to npm https://www.npmjs.com/package/@double-observer/react-client
- [x] add local RNBundle server
- [x] add local RNBundle client with ClientActions handler
- [x] add ReFrameReactFlightClientConfig

- [x] Chunk$forEach
- [x] dynamically generate the ReFrameReactFlightClientConfig from each app
- [x] React 18 Expo 52 demo of client components

- [x] organize the react-client types
- [x] refactor the react-client types to be correctly generic and less tied to the webpack implementation
- [x] SSRModuleMap
- [x] ClientRefKey

- [ ] ~~re-organize stuff such that I can publish the types separately from the react code itself~~

- [x] generate types for @double-observer/react-server
  - [x] react-server/flight.d.ts
  - [x] react-server/index.d.ts
  - [ ] double check that everything is typed

- [x] generate types for @double-observer/react-server-dom-esm
  - [x] ReactClientValue
  - [x] ReactServerValue
  - [ ] createTemporaryReferenceSet

---

### WIP -- dependency hell

- switch back to bun
- set up the monorepo as two separate workspaces
- use overrides at the root of the demos workspace to link to the local packages of the main workspace

- [ReFrame workspace](./package.json)
  - [Next.js 15 App demo](./19-demos/next15-app-demo-1/package.json)
- [React 18 Demos workspace](./18-demos/package.json)
  - [Next.js 14 Pages demo](./18-demos/next14-pages-demo-1/package.json)
  - [Expo 52 Demo](./18-demos/expo52-demo-1/package.json)
  - [one v1.1 Demo](./18-demos/one1.1-demo-1/package.json)

---

### NEXT


- [ ] figure out how to handle server refs on the client
  - [ ] generate some RSC code that uses both client and server refs



- [ ] publish @double-observer/react-server to npm https://www.npmjs.com/package/@double-observer/react-server
- [ ] publish @double-observer/react-server-dom-esm to npm https://www.npmjs.com/package/@double-observer/react-server-dom-esm


- [ ] setup all the @double-observer/reframe exports and conditions

  - [x] @double-observer/reframe/client from client (react-native / expo)
    - [x] [demo](./demos/reframe-expo-demo-1/app/(tabs)/rsc-stream.tsx)

  - [ ] @double-observer/reframe/server from server (bun)
    - [ ] [demo](./demos/reframe-server-demo-rsc/server-render-demo.tsx)

  - [ ] @double-observer/reframe/server from server (nodejs 23)
  - [ ] @double-observer/reframe/server from server (deno)
  - [ ] @double-observer/reframe/server from server (PHP)
  - [ ] @double-observer/reframe/server from server (Rails 8)


  - [ ] @double-observer/reframe/client from client (browser / next.js)
  - [ ] @double-observer/reframe/client from client (browser / importMap / unbundled)
  - [ ] @double-observer/reframe/client from server
  - [ ] @double-observer/reframe/server from client

- [ ] React 18 Expo 52 demo of server rendering
- [ ] create multiple client implementations of the same spec

---

# NEXT

GOAL: end-to-end RSC streaming demo

---

- [ ] publish StreamingFragment client to jsr

---

# Done

---

# Brain dump

<details><summary>Brain dump of random stuff I want to do</summary>

- [ ] document StreamingFragment

- [ ] make `bun dev` do something
- [ ] repo root `bun demo` script

- [ ] ReFramed ui libs

  - [ ] ReFramed Tamagui
  - [ ] ReFramed NativeWindUI
  - [ ] ReFramed Restyle
  - [ ] ReFramed Unistyle

- [ ] ReFramed NativeWind / Tailwind

---

- [ ] "close the loop"

- [ ] setup self-hosted Github action runner
- [ ] customize your repository’s social media preview
- [ ] RN ReFrame Browser app

  - [ ] expose wacky native APIs with permissions?

- [ ] custom client component bundle versioning
- [ ] demo with custom client components

- [ ] demo with shell scripts
- [ ] demo with Next.js
- [ ] demo with Expo 52
- [ ] demo with SSE
- [ ] demo with WebSockets
- [ ] demo with Durable Objects
- [ ] demo with Ruby on Rails 8

- [ ] add a LICENSE file

- [ ] configure nix-shell
- [ ] add commands for publishing
- [ ] automatically publish your package from GitHub Actions
- [ ] publish to jsr -- all the other packages
- [ ] publish to jsr -- reframe

https://jsr.io/@subtlegradient/reframe/publish

```json filename="jsr.json"
{
  "$schema": "https://jsr.io/schema/config-file.v1.json",
  "name": "@subtlegradient/reframe",
  "version": "2024.12.7",
  "license": "MIT",
  "exports": {}
}
```

</details>

---

# ARCHIVE

---

<details><summary>ARCHIVED STUFF</summary>

- [x] publish to [GitHub](https://github.com/subtleGradient/ReFrame?tab=readme-ov-file)
- [x] configure git to use zed for commit messages
- [x] configure git to use opendiff as merge tool

---

using JXA via shell, read an environment variable

```sh
SOME_RANDOM_VAR="`date`" osascript -l JavaScript -e '$.NSProcessInfo.processInfo.environment.objectForKey("SOME_RANDOM_VAR").js'
osascript -l JavaScript -e 'let env = $.NSProcessInfo.processInfo.environment.js; for (let k in env) console.log(k, "=", env[k].js)'
```

using JXA via shell, prompt the user for some text

```sh
osascript -l JavaScript -e 'const app = Application.currentApplication(); app.includeStandardAdditions = true; const text = app.displayDialog("Enter some text:", { defaultAnswer: "" }).textReturned; console.log(text)'
```

---

- [x] create a nix-shell config that includes the tools I need to work on this project:
      bun, ollama, git
- [x] install nix
- [x] sh.sh
- [x] shell.nix

create a shell script that starts a nix shell using the config in my monorepo root directory, use the invariant pattern to verify all assumptions before proceeding to each step. have a single global error handler that logs all the errors and informs the user what they need to do to fix the problem. e.g. install and configure nix for this project

change the sh.sh script to not require nix to be installed. first, check for each required tool and verify that the version is correct. if any tool is missing, THEN try using nix-shell to make them available. then check again. if any tool is still missing, inform the user what they need to do to fix the problem by either installing nix or manually install the missing tool

the logs should look like this:

while checking:
🔍 in a git repository? ...

when the check passed, replace with something like:
✅ in a git repository

when check failed with warning, replace with something like:
⚠️ not in a git repository. (some features may not work as expected)

when check failed, with panic, replace with something like:
🚫 not in a git repository. (cd into a git repository and try again)
🥺 Script doesn't know how to continue

use different error/return codes for an unrecoverable error and a recoverable error

let me specify the tools I need in a config file that is shared between both sh.sh and shell.nix, maybe include them in the package.json file somewhere idiomatic?

I want to store environment dependencies and expectations in my monorepo package.json files. What's the least unexpected and most supported way of doing that?

---

- [x] make a shell oneliner that watches for changes to the TODO.md file and if git status is otherwise clean, commit the changes to the TODO.md file

```sh
fswatch -0 TODO.md | while read -d "" event; do if [ -z "$(git status --porcelain | grep -v "TODO.md")" ]; then git add TODO.md && git commit -m 'todo++'; fi; done
```

- [x] put it somewhere useful

- [x] create a shell oneliner that watches for changes and then clears the screen, prints the current branch name, upstream branch name, and the git status

---

- [x] modularize todo auto-commit workflow
- [x] hide the postinstall message when running `bun install` unless it fails

---

let's get a basic Expo Go app running

- [x] add a /demos directory to the monorepo config
- [x] npx create-expo-stack@latest reframe-expo-demo-0 --expo-router --drawer+tabs --stylesheet --bun
- [x] configure prettier for the monorepo
      yarn dlx expo-doctor
      yarn dlx expo install --check
      yarn dlx expo install @expo/metro-runtime

- [x] create demos/reframe-expo-demo-1; get it to run in web

conclusion: create-expo-stack is bad and should feel bad

- [ ] ~~get reframe-expo-demo-0 running in web~~

Metro error: Cannot read properties of undefined (reading 'ReactCurrentDispatcher')

it's a problem with the React version
need to fix the resolution of the React version in this demo
fixed the react version conflict by switching to yarn
but reframe-expo-demo-0 still doesn't work, so I just created a new demo using `yarn create expo demos/reframe-expo-demo-1` and it worked immediately

- [x] bun -> yarn because of the react 18 & react 19 conflict
- ~~bun doesn't support overrides or resolutions properly~~
- ~~pnpm doesn't support workspaces? I don't care. I don't want to learn a new thing. yarn 4 seems to work fine.~~
- [x] get reframe-expo-demo-1 running

---

end-to-end streaming text demo

- [x] install deno
- [x] create a server that streams text to the client using deno

> from the repo root
> bun sh
> cd demos/reframe-server-demo-deno-0
> deno run --allow-net main.ts
> open http://0.0.0.0:8000/
> should see a stream of time updates come in every second

- [x] render the streaming text in the demo app
- [x] create @double-observer/reframe
- [x] create StreamingFragment
- [x] yarn workspace reframe-expo-demo-1 add @double-observer/reframe

> from the repo root
> bun sh
> cd demos/reframe-expo-demo-1
> yarn web
> browser window should open
> nav to http://localhost:8081/text-stream
> should see the streaming text in the app

- [x] add another streaming fragment to the demo app that reads from the deno server
- [x] fix dark mode
- [x] [Reanimated] Mismatch between JavaScript code version and Reanimated Babel plugin version (3.16.3 vs. 3.16.2).
- [x] signal.throwIfAborted is not a function
- [x] verify the demo works in ios
- [x] disconnect / stop iteration when navigating away from a screen
- [x] error boundary for the streaming text component demo
- [x] missing `key` warning with StreamingFragment
- [x] package exports for StreamingFragment
- [x] StreamingFragment client/server files & types

</details>
