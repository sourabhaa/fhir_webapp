<script>
  import { onMount } from 'svelte';
  import { fetchPatients, patientStore } from "./../stores/patientStore";
  import { baseUrlStore } from "../stores/baseUrlStore";
  import AddVitalsModal from './AddVitalsModal.svelte';
  import { navigate } from "svelte-routing"; // Ensure navigate is imported

  let patient = {
    id: "",
    name: "",
    birthDate: "",
    gender: "",
  };
  let vitals = [];
  let baseURL = '';

  // Subscribe to baseURL and patientStore
  baseUrlStore.subscribe(value => {
    baseURL = value;
  });

  $: patientStore.subscribe((value) => {
    console.log("value of patient from store: ", value)
    if (value && Object.keys(value).length > 0) {
      patient = value;
      console.log("Current patient details in PatientDetail: ", patient);
      fetchData();
    } else {
      console.log("No patient selected.");
    }
  });

  // Fetch patient vitals data
  async function fetchData() {
    try {
      if (patient.id && baseURL) {
        const response = await fetch(`${baseURL}/Observation?patient=${patient.id}&category=vital-signs`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        vitals = data.entry || [];
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert(`Error: ${error.message}`);
    }
  }

  const handleRefresh = () => {
    location.reload();
  }

  let showModal = false;

  const openModal = () => {
    showModal = true;
  };

  const closeModal = () => {
    showModal = false;
  };
</script>

<div class="flex flex-col items-start bg-main-bg p-6 rounded-lg shadow-lg">
  <div class="flex flex-row items-center justify-between details-card p-4 bg-accent-red text-white rounded-lg mb-4">
    <div>
      <h2 class="text-2xl font-bold">{patient.name}</h2>
      <p>ID: {patient.id}</p>
    </div>
    <div class="text-right">
      <p>Date of Birth: {patient.birthDate}</p>
      <p>Gender: {patient.gender}</p>
    </div>
  </div>

  <div class="bg-main-bg p-8 rounded-2xl min-w-6xl h-screen mx-auto">
    <div class="flex justify-between mb-8">
      <h2 class="text-3xl font-bold">Vitals</h2>
      <button class="bg-accent-red text-white py-2 px-4 rounded-lg" on:click={openModal}>Add Vital</button>
    </div>
    {#if showModal}
      <AddVitalsModal on:close={closeModal} />
    {/if}

    <table class="w-full border-collapse border border-gray-200">
      <thead>
        <div class="table-container">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="border border-gray-300 px-4 py-2">ID</th>
                <th class="border border-gray-300 px-4 py-2">Record DateTime</th>
                <th class="border border-gray-300 px-4 py-2">Parameter</th>
                <th class="border border-gray-300 px-4 py-2">Value</th>
                <th class="border border-gray-300 px-4 py-2">UofM</th>
              </tr>
            </thead>
            <tbody>
              {#each vitals as entry, index}
                {#if entry.resource.code.coding.some(code => code.code === "35094-2")}
                  {#each entry.resource.component as component, idx}
                    <tr class={index % 2 ? 'bg-gray-50' : 'bg-white'}>
                      {#if idx === 0}
                        <td rowspan="2" class="border border-gray-300 px-4 py-2">{entry.resource.id}</td>
                        <td rowspan="2" class="border border-gray-300 px-4 py-2">{new Date(entry.resource.effectiveDateTime).toLocaleString()}</td>
                      {/if}
                      <td class="border border-gray-300 px-4 py-2">{component.code.coding[0].display}</td>
                      <td class="border border-gray-300 px-4 py-2">{component.valueQuantity.value}</td>
                      <td class="border border-gray-300 px-4 py-2">{component.valueQuantity.unit}</td>
                    </tr>
                  {/each}
                {:else}
                  <tr class={index % 2 ? 'bg-gray-50' : 'bg-white'}>
                    <td class="border border-gray-300 px-4 py-2">{entry.resource.id}</td>
                    <td class="border border-gray-300 px-4 py-2">{new Date(entry.resource.effectiveDateTime).toLocaleString()}</td>
                    <td class="border border-gray-300 px-4 py-2">{entry.resource.code.coding[0].display}</td>
                    <td class="border border-gray-300 px-4 py-2">{entry.resource.valueQuantity.value}</td>
                    <td class="border border-gray-300 px-4 py-2">{entry.resource.valueQuantity.unit}</td>
                  </tr>
                {/if}
              {/each}
            </tbody>
          </table>
        </div>
      </thead>
    </table>
  </div>
</div>

<style>
  .bg-main-bg {
    min-width: 80vw;
  }
  .details-card {
    min-width: 77vw;
  }

 .table-container {
    max-height: 55vh; /* Adjust the height as needed */
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

