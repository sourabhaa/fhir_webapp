import { writable } from "svelte/store";
import axios from "axios";
import { baseUrlStore } from "../stores/baseUrlStore";
// Define the writable store for the list of patients
export const patients = writable([]);

// Define the writable store for the selected patient details
export const patientStore = writable({});

// Subscribe to the baseUrlStore to get the current baseUrl
let baseURL = "";
baseUrlStore.subscribe((value) => {
  baseURL = value;
  // Optional: You can also store the baseURL in local storage here
  localStorage.setItem("baseUrl", baseURL);
});

// Function to fetch the list of patients
export const fetchPatients = async () => {
  try {
    const response = await axios.get(`${baseURL}/Patient`);
    if (response.data.entry) {
      // Update the patients store with the fetched data
      patients.set(response.data.entry.map((entry) => entry.resource));
    }
  } catch (error) {
    console.error("Error fetching patients:", error);
  }
};
