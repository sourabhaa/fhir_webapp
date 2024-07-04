import "./styles/tailwind.css";
import App from "./App.svelte";

const app = new App({
  target: document.getElementById("app"),
});

export default app;

// import App from "./App.svelte";
// import { Router } from "svelte-routing";

// const app = new App({
//   target: document.body,
//   props: {},
//   intro: true,
// });

// export default app;
