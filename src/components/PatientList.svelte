<script>
  import {
    PenOutline,
    TrashBinOutline,
    EyeOutline,
  } from "flowbite-svelte-icons";
  import patients from "../stores/patientStore.js";
  import { onMount } from "svelte";

  let patientList = [];

  $: patients.subscribe((value) => {
    patientList = value;
    console.log("PATIENTILIST: ", patientList);
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
        <tr>
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

          <button class="text-blue-500 hover:text-blue-700 mr-2">
            <PenOutline class="w-5 h-5" />
          </button>
          <button class="text-red-500 hover:text-red-700">
            <TrashBinOutline class="w-5 h-5" />
          </button>
          <button class="text-black-500 hover:text-black-700 p-2">
            <EyeOutline class="w-5 h-5" />
          </button>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .table-container {
    max-height: 500px; /* Adjust the height as needed */
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
