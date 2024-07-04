<script lang="ts">
  import { PenOutline, EyeOutline } from "flowbite-svelte-icons";
  import { onMount } from "svelte";
  import { Button, Modal } from "flowbite-svelte";
  import { navigate } from "svelte-routing";
  import {fetchPatients,patients, patientStore} from '../stores/doctorStore'
  import { baseUrlStore } from "../stores/baseUrlStore";
let baseURL = "";
baseUrlStore.subscribe((value) => {
  baseURL = value;
  // Optional: You can also store the baseURL in local storage here
  localStorage.setItem("baseUrl", baseURL);
});
  // const baseURL = import.meta.env.VITE_BASE_URL;

  const qualifications = [
    { specialty: "General Practitioner", code: "208D00000X", display: "General Practice" },
    { specialty: "Cardiologist", code: "207RC0000X", display: "Cardiovascular Disease (Cardiology)" },
    { specialty: "Nephrologist", code: "207RN0300X", display: "Nephrology" },
    { specialty: "Neurologist", code: "2084N0400X", display: "Neurology" },
    { specialty: "Orthopaedic Surgeon", code: "207X00000X", display: "Orthopaedic Surgery" },
    { specialty: "General Surgeon", code: "208600000X", display: "Surgery" },
    { specialty: "Internist", code: "207R00000X", display: "Internal Medicine" },
  ];

  let doctorList = [];

  // $: patients.subscribe((value) => {
  //   doctorList = value;
  //   // console.log("doctorList: ", doctorList);
  // });

  $: patients.subscribe(value => {
    doctorList = value.map(resource => ({
      id: resource.id || '-',
      name: resource.name && resource.name[0] ? resource.name[0] : { given: ['-'], family: '-' },
      gender: resource.gender || '-',
      qualification: resource.qualification && resource.qualification[0] ? resource.qualification[0] : { code: { coding: [{ display: '-' }] } }
    }));
  });


  function goToDoctorDetail(doctor) {
    navigate(`/doctor/${doctor.id}`);
  }

  let modalVisible = false;
  let editMode = false;
  let addMode = false;
  let selectedDoctor = {};

  function openModal(doctor = {}, isEdit = false, isAdd = false) {
    modalVisible = true;
    editMode = isEdit;
    addMode = isAdd;
    selectedDoctor = { ...doctor };
  }

  function closeModal() {
    modalVisible = false;
  }

  async function saveDoctor() {
    try {
      const method = addMode ? "POST" : "PUT";
      const url = addMode ? `${baseURL}/Practitioner` : `${baseURL}/Practitioner/${selectedDoctor.id}`;
      
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resourceType: "Practitioner",
          identifier: [
            {
              type: {
                coding: [{ system: "http://terminology.hl7.org/CodeSystem/v2-0203", code: "NPI", display: "National Provider Identifier" }],
              },
              system: "https://npiregistry.cms.hhs.gov",
              value: selectedDoctor.identifierNPI,
            },
            {
              type: {
                coding: [{ system: "http://terminology.hl7.org/CodeSystem/v2-0203", code: "SS", display: "Social Security Number" }],
              },
              value: selectedDoctor.identifierSS,
            }
          ],
          name: [{ given: [selectedDoctor.firstName], family: selectedDoctor.lastName }],
          gender: selectedDoctor.gender,
          qualification: [
            {
              code: {
                coding: [
                  {
                    system: "http://nucc.org/provider-taxonomy",
                    code: selectedDoctor.qualificationCode,
                    display: qualifications.find(q => q.code === selectedDoctor.qualificationCode).display,
                  }
                ]
              }
            }
          ]
        }),
      });

      if (response.ok) {
        closeModal();
        fetchPatients();
      } else {
        console.error("Failed to save doctor");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  onMount(fetchPatients);
</script>


  <div class="flex justify-between items-center mb-4">
    <h2 class="text-lg font-semibold">Doctor List</h2>
    <Button color='red' on:click={() => openModal({}, false, true)}>Add Doctor</Button>
  </div>
  <div class="table-container">
  <table class="min-w-full divide-y divide-gray-200">
    <thead class="bg-gray-50">
      <tr>
        <th scope="col" class="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
        <th scope="col" class="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
        <th scope="col" class="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
        <th scope="col" class="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualification</th>
        <th scope="col" class="sticky top-0 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200 overflow-y-auto">
      {#each doctorList as doctor}
        <tr>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.id}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doctor.name.given ? doctor.name.given.join(' ') : '-'}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{doctor.name.family || '-'}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.qualification.code.coding[0].display || '-'}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500" on:click|stopPropagation>
            <button class="text-blue-500 hover:text-blue-700 mr-2" on:click={() => openModal(doctor, true)}>
              <PenOutline class="w-5 h-5" />
            </button>
            <button on:click={() => openModal(doctor, false)} class="text-black-500 hover:text-black-700 p-2">
              <EyeOutline class="w-5 h-5" />
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  <Modal title={addMode ? "Add Doctor" : editMode ? "Edit Doctor" : "Doctor Details"} bind:open={modalVisible} autoclose={false}>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Identifier - NPI:</label>
        {#if addMode || editMode}
          <input type="text" class="mt-1 p-2 w-full border border-gray-300 rounded" bind:value={selectedDoctor.identifierNPI} required />
        {:else}
          <span class="mt-1 p-2 w-full border border-gray-300 rounded block">{selectedDoctor.identifierNPI}</span>
        {/if}
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Identifier - SSN:</label>
        {#if addMode || editMode}
          <input type="text" class="mt-1 p-2 w-full border border-gray-300 rounded" bind:value={selectedDoctor.identifierSS} />
        {:else}
          <span class="mt-1 p-2 w-full border border-gray-300 rounded block">{selectedDoctor.identifierSS}</span>
        {/if}
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">First Name:</label>
        {#if addMode || editMode}
          <input type="text" class="mt-1 p-2 w-full border border-gray-300 rounded" bind:value={selectedDoctor.firstName} required />
        {:else}
          <span class="mt-1 p-2 w-full border border-gray-300 rounded block">{selectedDoctor.firstName}</span>
        {/if}
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Last Name:</label>
        {#if addMode || editMode}
          <input type="text" class="mt-1 p-2 w-full border border-gray-300 rounded" bind:value={selectedDoctor.lastName} required />
        {:else}
          <span class="mt-1 p-2 w-full border border-gray-300 rounded block">{selectedDoctor.lastName}</span>
        {/if}
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Gender:</label>
        {#if addMode || editMode}
          <select class="mt-1 p-2 w-full border border-gray-300 rounded" bind:value={selectedDoctor.gender} required>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        {:else}
          <span class="mt-1 p-2 w-full border border-gray-300 rounded block">{selectedDoctor.gender}</span>
        {/if}
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Qualification:</label>
        {#if addMode || editMode}
          <select class="mt-1 p-2 w-full border border-gray-300 rounded" bind:value={selectedDoctor.qualificationCode} required>
            {#each qualifications as qual}
              <option value={qual.code}>{qual.specialty}</option>
            {/each}
          </select>
        {:else}
          <span class="mt-1 p-2 w-full border border-gray-300 rounded block">{qualifications.find(q => q.code === selectedDoctor.qualificationCode)?.specialty}</span>
        {/if}
      </div>
    </div>
    <div class="flex justify-end mt-4">
      {#if editMode || addMode}
        <Button outline color="red" class="mx-4" on:click={saveDoctor}>Save</Button>
      {/if}
      <Button outline color="dark" class="mx-4" on:click={closeModal}>Cancel</Button>
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
