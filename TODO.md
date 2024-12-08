Decisions

- nix is recommended for development, but not required

# Work in progress

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
- [x] create @sublegradient/reframe-bridge
- [x] create StreamingFragment
- [ ] document StreamingFragment
- [x] yarn workspace reframe-expo-demo-1 add @sublegradient/reframe-bridge

> from the repo root
> bun sh
> cd demos/reframe-expo-demo-1
> yarn web
> browser window should open
> nav to http://localhost:8081/text-stream
> should see the streaming text in the app

- [x] add another streaming fragment to the demo app that reads from the deno server


- [ ] make `bun dev` do something


---

# NEXT

GOAL: Make something work in Expo Go and Next.js 15 simultaneously

---

- [ ] react-client build for React 18
  - [ ] React 18 Expo 52 demo

---

# Done

---

# Brain dump

<details><summary>Brain dump of random stuff I want to do</summary>

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

</details>
