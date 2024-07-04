<script>
  import { onMount } from 'svelte';
  import labServicesData from '../assets/lab_services.json';

  let labServices = [];
  let showModal = false;
  let selectedResultParams = [];

  onMount(() => {
    labServices = labServicesData.labServices;
  });

  function openModal(resultParams) {
    selectedResultParams = resultParams;
    showModal = true;
  }

  function closeModal() {
    showModal = false;
  }
</script>

<style>
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }

  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
</style>

<div class="bg-main-bg rounded-3xl p-8 shadow-lg">
  <h2 class="text-3xl font-bold mb-6">Lab Services</h2>
  <table class="min-w-full divide-y divide-gray-200 max-h-table-xl overflow-auto">
    <thead class="bg-gray-100">
      <tr>
        <th class="border px-4 py-2">Service Code</th>
        <th class="border px-4 py-2">Service Name</th>
        <th class="border px-4 py-2">Specimen</th>
        <th class="border px-4 py-2">Container Type</th>
        <th class="border px-4 py-2">LOINC Code</th>
        <th class="border px-4 py-2">Actions</th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      {#each labServices as service}
        <tr class="hover:bg-gray-50">
          <td class="border px-4 py-2">{service.serviceCode}</td>
          <td class="border px-4 py-2">{service.serviceName}</td>
          <td class="border px-4 py-2">{service.specimen}</td>
          <td class="border px-4 py-2">{service.containerType}</td>
          <td class="border px-4 py-2">{service.loincCode}</td>
          <td class="border px-4 py-2 text-center">
            <button class="text-blue-600 hover:text-blue-800" on:click={() => openModal(service.resultParams)}>
              <span role="img" aria-label="View Details">👁️</span>
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  {#if showModal}
    <div class="modal-backdrop" on:click={closeModal}></div>
    <div class="modal rounded-xl">
      <h2 class="text-2xl font-bold mb-4">Result Parameters</h2>
      <table class="min-w-full divide-y divide-gray-200 max-h-table-md overflow-auto">
        <thead class="bg-gray-100">
          <tr>
            <th class="border px-4 py-2">Sequence</th>
            <th class="border px-4 py-2">Result Code</th>
            <th class="border px-4 py-2">LOINC Code</th>
            <th class="border px-4 py-2">Result Name</th>
            <th class="border px-4 py-2">UofM</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each selectedResultParams as param}
            <tr class="hover:bg-gray-50">
              <td class="border px-4 py-2">{param.sequence}</td>
              <td class="border px-4 py-2">{param.resultCode}</td>
              <td class="border px-4 py-2">{param.loincCode}</td>
              <td class="border px-4 py-2">{param.resultName}</td>
              <td class="border px-4 py-2">{param.uofm}</td>
            </tr>
          {/each}
        </tbody>
      </table>
      <button class="mt-4 bg-accent-red text-white px-4 py-2 rounded-lg hover:bg-red-600" on:click={closeModal}>Close</button>
    </div>
  {/if}
</div>