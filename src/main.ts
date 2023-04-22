import { createApp } from "vue";
import App from "./App.vue";
import './style.css'

// Composants graphiques
import PrimeVue from "primevue/config";
import "primevue/resources/themes/saga-purple/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css"; 
import ToastService from "primevue/toastservice";

const app = createApp(App);

app
  .use(PrimeVue)
  .use(ToastService)
  .mount("#app");
