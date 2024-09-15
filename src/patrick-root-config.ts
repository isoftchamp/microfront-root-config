import { registerApplication, start } from "single-spa";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";
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
