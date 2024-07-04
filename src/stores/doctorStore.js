import { writable } from "svelte/store";
import axios from "axios";

// Define the writable store for the list of patients
export const patients = writable([]);

// Define the writable store for the selected patient details
export const patientStore = writable({});

// Define the base URL for the FHIR server
// const baseURL = import.meta.env.VITE_BASE_URL;

import { baseUrlStore } from "../stores/baseUrlStore";
let baseURL = "";
baseUrlStore.subscribe((value) => {
  baseURL = value;
  // Optional: You can also store the baseURL in local storage here
  localStorage.setItem("baseUrl", baseURL);
});

// Function to fetch the list of patients
export const fetchPatients = async () => {
  try {
    const response = await axios.get(`${baseURL}/Practitioner`);
    if (response.data.entry) {
      // Update the patients store with the fetched data
      patients.set(response.data.entry.map((entry) => entry.resource));
    }
  } catch (error) {
    console.error("Error fetching patients:", error);
  }
};

// export const fetchPatients = async () => {
//   try {
//     const response = await axios.get(`${baseURL}/Practitioner`);
//     if (response.data.entry) {
//       // Update the patients store with the fetched data
//       const patientData = response.data.entry.map((entry) => {
//         const resource = entry.resource;
//         return {
//           id: resource.id,
//           name: resource.name
//             ? resource.name
//                 .map((n) => `${n.given.join(" ")} ${n.family}`)
//                 .join(", ")
//             : "Unknown",
//           gender: resource.gender || "Unknown",
//           qualification: resource.qualification
//             ? resource.qualification
//                 .map((q) => q.code.coding.map((c) => c.display).join(", "))
//                 .join(", ")
//             : "Unknown",
//           identifier: resource.identifier
//             ? resource.identifier
//                 .map((id) => `${id.type.coding[0].display}: ${id.value}`)
//                 .join(", ")
//             : "Unknown",
//         };
//       });
//       patients.set(patientData);
//     }
//   } catch (error) {
//     console.error("Error fetching patients:", error);
//   }
// };
