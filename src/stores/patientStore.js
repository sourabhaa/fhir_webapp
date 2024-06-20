import { writable } from "svelte/store";
import axios from "axios";

// Define the writable store for the list of patients
export const patients = writable([]);

// Define the writable store for the selected patient details
export const patientStore = writable({});

// Define the base URL for the FHIR server
const baseURL = import.meta.env.VITE_BASE_URL;

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