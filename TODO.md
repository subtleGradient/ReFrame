Decisions

- nix is recommended for development, but not required

Stuff that I plan to do


# Work in progress


---

make a shell oneliner that watches for changes to the TODO.md file and if git status is otherwise clean, commit the changes to the TODO.md file, using ollama llama3.2:latest to write the commit message

create a shell oneliner that watches for changes and then clears the screen, prints the current branch name, upstream branch name, and the git status

---


- [ ] "close the loop"
  - [ ] make `bun dev` do something

- [ ] ...

---

# NEXT

GOAL: Make something work in Expo Go and Next.js 15 simultaneously




---

- [ ] react-client build for React 18
  - [ ] React 18 Expo 52 demo

---

# Done

- [x] publish to [GitHub](https://github.com/subtleGradient/ReFrame?tab=readme-ov-file)
- [x] configure git to use zed for commit messages
- [x] configure git to use opendiff as merge tool

---

# Brain dump

<details><summary>Brain dump of random stuff I want to do</summary>


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

<details><summary>shell JXA stuff</summary>

using JXA via shell, read an environment variable

```sh
SOME_RANDOM_VAR="`date`" osascript -l JavaScript -e '$.NSProcessInfo.processInfo.environment.objectForKey("SOME_RANDOM_VAR").js'
osascript -l JavaScript -e 'let env = $.NSProcessInfo.processInfo.environment.js; for (let k in env) console.log(k, "=", env[k].js)'
```

using JXA via shell, prompt the user for some text

```sh
osascript -l JavaScript -e 'const app = Application.currentApplication(); app.includeStandardAdditions = true; const text = app.displayDialog("Enter some text:", { defaultAnswer: "" }).textReturned; console.log(text)'
```
</details>

---

<details><summary>tool dependencies and expectations</summary>

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

</details>
