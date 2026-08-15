import { TransactionStore } from "./store.js";
import { initUI } from "./ui.js";

const store = new TransactionStore();
initUI(store);
