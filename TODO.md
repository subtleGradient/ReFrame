Stuff that I plan to do


# Work in progress


---

# NEXT

- [ ] react-client build for React 18
  - [ ] React 18 Expo 52 demo

---

# Done

- [x] publish to [GitHub](https://github.com/subtleGradient/ReFrame?tab=readme-ov-file)
- [x] configure git to use zed for commit messages
- [x] configure git to use opendiff as merge tool

---

# Brain dump

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

---

# Random stuff that I forget why I wanted it

using JXA via shell, read an environment variable

```sh
SOME_RANDOM_VAR="`date`" osascript -l JavaScript -e '$.NSProcessInfo.processInfo.environment.objectForKey("SOME_RANDOM_VAR").js'
osascript -l JavaScript -e 'let env = $.NSProcessInfo.processInfo.environment.js; for (let k in env) console.log(k, "=", env[k].js)'
```

using JXA via shell, prompt the user for some text

```sh
osascript -l JavaScript -e 'const app = Application.currentApplication(); app.includeStandardAdditions = true; const text = app.displayDialog("Enter some text:", { defaultAnswer: "" }).textReturned; console.log(text)'
```
