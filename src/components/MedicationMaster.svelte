<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import { Modal } from "flowbite-svelte";
  import axios from "axios";

  const dispatch = createEventDispatcher();
  let medications = [];
  let modalVisible = false;
  let isEditing = false;
  let selectedMedication = null;
  let newMedication = {
    id: "",
    code: "",
    name: "",
    status: "active"
  };
  import { baseUrlStore } from "../stores/baseUrlStore";
// Subscribe to the baseUrlStore to get the current baseUrl
let baseURL = "";
baseUrlStore.subscribe((value) => {
  baseURL = value;
  // Optional: You can also store the baseURL in local storage here
  localStorage.setItem("baseUrl", baseURL);
});
  // const baseURL = import.meta.env.VITE_BASE_URL;

  onMount(async () => {
    await fetchMedications();
  });

  async function fetchMedications() {
    try {
      const response = await axios.get(`${baseURL}/Medication`);
      medications = response.data.entry.map(entry => ({
        id: entry.resource.id,
        code: entry.resource.code.coding[0].code,
        name: entry.resource.code.coding[0].display,
        status: entry.resource.status
      }));
    } catch (error) {
      console.error("Error fetching medications:", error);
    }
  }

  function openModal(medication = null) {
    isEditing = medication !== null;
    selectedMedication = medication;
    if (isEditing) {
      newMedication = { ...medication };
    } else {
      newMedication = {
        id: "",
        code: "",
        name: "",
        status: "active"
      };
    }
    modalVisible = true;
  }

  function closeModal() {
    modalVisible = false;
  }

  async function saveMedication() {
    const medicationData = {
      resourceType: "Medication",
      id: newMedication.id,
      code: {
        coding: [
          {
            system: "http://www.nlm.nih.gov/research/umls/rxnorm",
            code: newMedication.code,
            display: newMedication.name
          }
        ],
        text: newMedication.name
      },
      status: newMedication.status
    };

    try {
      if (isEditing) {
        await axios.put(`${baseURL}/Medication/${selectedMedication.id}`, medicationData);
        dispatch("notify", { message: "Medication updated successfully", type: "success" });
      } else {
        await axios.post(`${baseURL}/Medication`, medicationData);
        dispatch("notify", { message: "Medication added successfully", type: "success" });
      }
      closeModal();
      await fetchMedications();
    } catch (error) {
      console.error("Error saving medication:", error);
      dispatch("notify", { message: "Error saving medication", type: "error" });
    }
  }
</script>

<aside class="bg-sidebar-bg w-full h-full p-4 text-gray-700 rounded-l-xl">
  <div class="flex justify-between items-center">
    <h1 class="text-xl font-bold">Medication Master</h1>
    <button on:click={() => openModal()} class="bg-red-500 text-white px-4 py-2 rounded">New Medication</button>
  </div>
  <div class="table-container">
  <table class="min-w-full mt-6 bg-white shadow-md rounded-lg">
    <thead>
      <tr class="bg-base-layer">
        <th class="py-2 px-4">ID</th>
        <th class="py-2 px-4">Code</th>
        <th class="py-2 px-4">Medication Name</th>
        <th class="py-2 px-4">Status</th>
        <th class="py-2 px-4">Action</th>
      </tr>
    </thead>
    <tbody>
      {#each medications as medication}
        <tr>
          <td class="py-2 px-4">{medication.id}</td>
          <td class="py-2 px-4">{medication.code}</td>
          <td class="py-2 px-4">{medication.name}</td>
          <td class="py-2 px-4">{medication.status}</td>
          <td class="py-2 px-4">
            <button on:click={() => openModal(medication)} class="text-blue-500">Edit</button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
  </div>

  <Modal title={isEditing ? "Edit Medication" : "New Medication"} bind:open={modalVisible} autoclose>
    <form class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Code:</label>
        <input type="text" bind:value={newMedication.code} class="mt-1 p-2 w-full border border-gray-300 rounded" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Medication Name:</label>
        <input type="text" bind:value={newMedication.name} class="mt-1 p-2 w-full border border-gray-300 rounded" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Status:</label>
        <select bind:value={newMedication.status} class="mt-1 p-2 w-full border border-gray-300 rounded">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div class="flex justify-end space-x-4">
        <button type="button" on:click={saveMedication} class="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
        <button type="button" on:click={closeModal} class="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
      </div>
    </form>
  </Modal>
</aside>




<style>
  .button:hover {
    color: #ee4d38;
  }
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
