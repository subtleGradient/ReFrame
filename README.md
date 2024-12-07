# ReFrame

It's kinda like iframes crossed with server side includes, but for React.
Render React Server Component streams in your React Native or React web app.

- React Native
- React (web)
- SOON: react-three-fiber

## How it works

### How it does not work

The React team’s full-stack architecture vision requires a bundler and assumes that your backend and frontend are tightly coupled. ReFrame allows you to decouple your frontend and backend by agreeing on a shared set of pre-defined client components. Your server uses ReFrame to skip the bundling step and stream these known components to the client. The client then renders these components in whatever way they want.

#### ReFrame does not work like Next.js

#### ReFrame does not work like Expo Router

---

## FAQ

### Can I use ReFrame with Next.js?

Yes.

### Can I use ReFrame with React 18?

Yes.

### Can I use ReFrame with Expo 52?

Yes.

### Can I use ReFrame with Expo Router?

Yes.
