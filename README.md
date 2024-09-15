# Root Config - Single-SPA Project

This repository contains the **root-config** for a Single-SPA application. The root-config serves as the entry point for orchestrating two React microfrontend apps that communicate with each other using RxJS.

## Project Overview

The root-config does not contain any business logic but manages the lifecycle of two React apps in a microfrontend architecture using the [single-spa](https://single-spa.js.org/) framework. It mounts, unmounts, and controls navigation between `react-app-1` and `react-app-2`.

## Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (>=18.x.x)
- npm (comes with Node.js)

## Getting Started

### 1. Install Dependencies

In the root-config directory, install the project dependencies by running:
```bash
npm install
```

### 2. Running the Root Config

To start the root-config in development mode:

```bash
npm start
```

The root-config will be served at `http://localhost:9000`, which loads the two microfrontend applications.

### 3. Microfrontend Setup

The root-config uses the `single-spa` library to register and load the microfrontend applications with custom props from `src/microfrontend-layout.html`. Here's an example from `src/patrick-root-config.js`:
```typescript
...
import microfrontendLayout from "./microfrontend-layout.html";

const routes = constructRoutes(microfrontendLayout);
const applications = constructApplications({
  routes,
  loadApp({ name }) {
    return System.import(name);
  },
});
const layoutEngine = constructLayoutEngine({ routes, applications });

const parser = new DOMParser();
const doc = parser.parseFromString(microfrontendLayout, "text/html");
applications.forEach((app) => {
  const el = doc.querySelector(`[name="${app.name}"]`);
  const appProps = el ? el.getAttribute("data-props") : "{}";
  app.customProps = JSON.parse(appProps);
  registerApplication(app);
});
layoutEngine.activate();
start();
```

Each React application is registered with its path and custom props from `src/microfrontend-layout.html` and the apps are loaded dynamically using SystemJS. Here's an example from `src/microfrontend-layout.html`:
```html
<route default>
  <div style="flex: 1;"><application name="@patrick/app1" data-props='{"target":"@patrick/app2"}'></application></div>
  <div style="flex: 1;"><application name="@patrick/app2" data-props='{"target":"@patrick/app1"}'></application></div>
</route>
```

### 4. SystemJS Import Maps

The root-config uses SystemJS import maps, which are specified in the index.ejs file. Here is an example configuration:
```
<script type="systemjs-importmap">
  {
    "imports": {
      "@patrick/app1": "//localhost:8080/patrick-react-app.js",
      "@patrick/app2": "//localhost:8081/patrick-react-app.js",
      "@patrick/root-config": "//localhost:9000/patrick-root-config.js"
    }
  }
</script>
```
The import maps define where the bundles for each microfrontend app are located. Each app is served on a different port.

## Folder Structure

```
root-config/
  ├── src/
  │   ├── index.ejs                  # HTML template for mounting the microfrontends
  │   ├── microfrontend-layout.html  # Layout for microfrontends
  │   └── patrick-root-config.ts     # Main entry point for configuring and registering the microfrontends
  └── package.json                   # Project metadata and scripts
```

* `patrick-root-config.ts`: The file where microfrontend applications are registered and configured using single-spa.
* `index.ejs`: The HTML template that mounts the microfrontends.
* `microfrontend-layout.html`: The Layout for microfrontends.
* `package.json`: Contains the dependencies, scripts, and configuration of the root-config.

## Available Scripts
In the `root-config` directory, you can run the following npm scripts:

`npm start`: Starts the development server on `http://localhost:9000`.
`npm run build`: Creates a production build of the `root-config`.
`npm run lint`: Lints the project using ESLint.
`npm run format`: Formats the code using Prettier.
