import { writable } from "svelte/store";

// Initialize the baseUrlStore with the value from local storage if available
const initialBaseUrl = localStorage.getItem("baseUrl") || "";
export const baseUrlStore = writable(initialBaseUrl);
