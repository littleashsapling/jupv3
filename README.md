## React to jupyter v3

Third version. Fingers crossed.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any errors in the console.

### `npm run build`

Builds the app for production to the `.next` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run start`

Starts the application in production mode.
The application should be compiled with \`npm run build\` first.

See the section in Next docs about [deployment](https://github.com/zeit/next.js/wiki/Deployment) for more information.

### Kernal Stuff

you have to go to binder and run the git, and launch it, otherwise you get an http error. To run the repo on binder, you will have to switch it to public otherwise it fails.

### The way it works

This is how data more or less flows though the project:

hostStorage -> host -> kernel -> kernelRunner(cell) ->index.js

Both head.js and nav.js are optional. There is also an optional component in index js called DebugView, which can be removed as well.

Flow-typed ( https://github.com/flow-typed/flow-typed) is a repository of 3rd party library interface definitions. base.js, channels.js, and jupyterAPI.js are all needed for the Kernel(via binder) to work with our cell component(kernelRunner).

### Goals

1. transition from flow to typescript
2. transition from next to snowpack
