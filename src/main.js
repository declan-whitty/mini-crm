import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

// Apply theme before mounting
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

const app = createApp(App);
app.use(router);
app.use(Toast);
app.mount("#app");
