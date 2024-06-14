import { writable } from "svelte/store";
import axios from "axios";

const baseURL = "http://localhost:8081/fhir";

const patients = writable([]);

export const fetchPatients = async () => {
  try {
    const response = await axios.get(`${baseURL}/Patient`);
    patients.set(response.data.entry.map((entry) => entry.resource));
    console.log("patients: ", patients);
  } catch (error) {
    console.error("Error fetching patients:", error);
  }
};

export default patients;
