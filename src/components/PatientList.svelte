<script>
  import {
    PenOutline,
    TrashBinOutline,
    EyeOutline,
  } from "flowbite-svelte-icons";
  import { onMount } from "svelte";
  import { setContext } from "svelte";
  import { Button, Modal } from "flowbite-svelte";
  import { navigate } from "svelte-routing";
import { patients, patientStore, fetchPatients } from "../stores/patientStore.js";

  // List to hold the patients fetched
  let patientList = [];

  // Subscribe to the patients store
  $: patients.subscribe((value) => {
    patientList = value;
    // console.log("patientList: ", patientList);
  });

  // Function to handle patient selection
  function goToPatientDetail(patient) {
    console.log("Selected patient: ", patient);
    const patientData = {
      id: patient.id,
      name: `${patient.name[0].given} ${patient.name[0].family}`,
      gender: patient.gender,
      birthDate: patient.birthDate,
    };
    console.log("patientData: ", patientData);
    patientStore.set(patientData); // Set the selected patient data
    navigate(`/patient/${patient.id}/vitals`); // Navigate to the patient detail page
  }
  
  let modalVisible = false;
  let editMode = false;

  let mrn, govId, firstName, lastName, gender, birthDate, email, phone;

  let newPatient = {
    id: 0,
    resourceType: "Patient",
    identifier: [
      {
        type: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v2-0203",
              code: "MR",
            },
          ],
        },
        value: "",
      },
      {
        type: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v2-0203",
              code: "govIdType",
              display: "govIdFull",
            },
          ],
        },
        value: "",
      },
    ],
    name: [
      {
        given: [""],
        family: "",
        use: "usual",
      },
    ],
    gender: "",
    birthDate: "",
    telecom: [
      {
        system: "email",
        value: "",
      },
      {
        system: "phone",
        value: "",
      },
    ],
  };

  function openModal(patient, isEdit = false) {
    modalVisible = true;
    editMode = isEdit;
    newPatient = { ...patient };

    mrn =
      newPatient.identifier.find((id) => id.type.coding[0].code === "MR")
        ?.value || "";
    govId =
      newPatient.identifier.find((id) => id.type.coding[0].code !== "MR")
        ?.value || "";
    firstName = newPatient.name[0].given[0] || "";
    lastName = newPatient.name[0].family || "";
    gender = newPatient.gender || "";
    birthDate = newPatient.birthDate || "";
    email = newPatient.telecom.find((t) => t.system === "email")?.value || "";
    phone = newPatient.telecom.find((t) => t.system === "phone")?.value || "";
  }

  function closeModal() {
    modalVisible = false;
  }

  function updatePatient() {
    newPatient.identifier.find((id) => id.type.coding[0].code === "MR").value =
      mrn;
    newPatient.identifier.find((id) => id.type.coding[0].code !== "MR").value =
      govId;
    newPatient.name[0].given[0] = firstName;
    newPatient.name[0].family = lastName;
    newPatient.gender = gender;
    newPatient.birthDate = birthDate;
    newPatient.telecom.find((t) => t.system === "email").value = email;
    newPatient.telecom.find((t) => t.system === "phone").value = phone;
  }

  // const baseURL = import.meta.env.VITE_BASE_URL;

  import { baseUrlStore } from "../stores/baseUrlStore";
// Subscribe to the baseUrlStore to get the current baseUrl
let baseURL = "";
baseUrlStore.subscribe((value) => {
  baseURL = value;
  // Optional: You can also store the baseURL in local storage here
  localStorage.setItem("baseUrl", baseURL);
});
  async function savePatient() {
    updatePatient();
    try {
      const response = await fetch(`${baseURL}/Patient/${newPatient.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPatient),
      });
      if (response.ok) {
        closeModal();
        fetchPatients();
      } else {
        console.error("Failed to update patient");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // Fetch the patients on component mount
  onMount(fetchPatients);

  $: patients.subscribe((value) => {
    patientList = value;
    // console.log("patientList: ", patientList);
  });

</script>

<div class="table-container">
  <table class="min-w-full divide-y divide-gray-200">
    <thead class="bg-gray-50">
      <tr>
        <th
          scope="col"
          class="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >ID</th
        >
        <th
          scope="col"
          class="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >First Name</th
        >
        <th
          scope="col"
          class="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >Last Name</th
        >
        <th
          scope="col"
          class="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >Date of Birth</th
        >
        <th
          scope="col"
          class="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >Gender</th
        >
        <th
          scope="col"
          class="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >Action</th
        >
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200 overflow-y-auto">
      {#each patientList as patient}
        <tr on:click={() => goToPatientDetail(patient)}>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {patient.id}
          </td>
          <td
            class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
          >
            {patient.name[0]?.given}
          </td>
          <td
            class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
          >
            {patient.name[0]?.family}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {patient.birthDate}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {patient.gender}
          </td>
          <td
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
            on:click|stopPropagation
          >
            <button
              class="text-blue-500 hover:text-blue-700 mr-2"
              on:click={() => openModal(patient, true)}
            >
              <PenOutline class="w-5 h-5" />
            </button>
            <button class="text-red-500 hover:text-red-700">
              <TrashBinOutline class="w-5 h-5" />
            </button>
            <button
              on:click={() => openModal(patient, false)}
              class="text-black-500 hover:text-black-700 p-2"
            >
              <EyeOutline class="w-5 h-5" />
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  <Modal
    title={editMode ? "Edit Patient" : "Patient Details"}
    bind:open={modalVisible}
    autoclose={false}
  >
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">MRN:</label>
        {#if editMode}
          <input
            type="text"
            class="mt-1 p-2 w-full border border-gray-300 rounded"
            bind:value={mrn}
          />
        {:else}
          <span class="mt-1 p-2 w-full border border-gray-300 rounded block">
            {mrn}
          </span>
        {/if}
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700"
          >Government ID:</label
        >
        {#if editMode}
          <input
            type="text"
            class="mt-1 p-2 w-full border border-gray-300 rounded"
            bind:value={govId}
          />
        {:else}
          <span class="mt-1 p-2 w-full border border-gray-300 rounded block">
            {govId}
          </span>
        {/if}
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700"
          >First Name:</label
        >
        {#if editMode}
          <input
            type="text"
            class="mt-1 p-2 w-full border border-gray-300 rounded"
            bind:value={firstName}
          />
        {:else}
          <span class="mt-1 p-2 w-full border border-gray-300 rounded block">
            {firstName}
          </span>
        {/if}
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Last Name:</label
        >
        {#if editMode}
          <input
            type="text"
            class="mt-1 p-2 w-full border border-gray-300 rounded"
            bind:value={lastName}
          />
        {:else}
          <span class="mt-1 p-2 w-full border border-gray-300 rounded block">
            {lastName}
          </span>
        {/if}
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Gender:</label>
        {#if editMode}
          <select
            class="mt-1 p-2 w-full border border-gray-300 rounded"
            bind:value={gender}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="unknown">Unknown</option>
          </select>
        {:else}
          <span class="mt-1 p-2 w-full border border-gray-300 rounded block">
            {gender}
          </span>
        {/if}
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700"
          >Date of Birth:</label
        >
        {#if editMode}
          <input
            type="date"
            class="mt-1 p-2 w-full border border-gray-300 rounded"
            bind:value={birthDate}
          />
        {:else}
          <span class="mt-1 p-2 w-full border border-gray-300 rounded block">
            {birthDate}
          </span>
        {/if}
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Email:</label>
        {#if editMode}
          <input
            type="email"
            class="mt-1 p-2 w-full border border-gray-300 rounded"
            bind:value={email}
          />
        {:else}
          <span class="mt-1 p-2 w-full border border-gray-300 rounded block">
            {email}
          </span>
        {/if}
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Phone:</label>
        {#if editMode}
          <input
            type="tel"
            class="mt-1 p-2 w-full border border-gray-300 rounded"
            bind:value={phone}
          />
        {:else}
          <span class="mt-1 p-2 w-full border border-gray-300 rounded block">
            {phone}
          </span>
        {/if}
      </div>
    </div>

    <div class="flex justify-end mt-4">
      {#if editMode}
        <Button  outline color="red"
        class="mx-4" on:click={savePatient}>Save</Button>
      {/if}
      <Button outline color="dark"
      class="mx-4" on:click={closeModal}>Close</Button>
    </div>
  </Modal>
</div>

<style>
  .table-container {
    max-height: 70vh; /* Adjust the height as needed */
    overflow-y: auto;
  }
  thead th {
    position: sticky;
    top: 0;
    background-color: #e8e8fd; /* Match with your design's header background color */
    z-index: 1; /* Ensure it stays above table rows */
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th,
  td {
    padding: 12px;
    text-align: left;
  }
  th {
    font-weight: 600;
    color: #4b5563; /* Header text color */
  }

  tbody tr:hover {
    background-color: #f8f8ff; /* Row hover effect */
  }
</style>
