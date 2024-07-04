<script>
  import { Button } from "flowbite-svelte";
  import { SearchOutline, PlusOutline } from "flowbite-svelte-icons";
  import { Modal } from "flowbite-svelte";
  import { baseUrlStore } from '../stores/baseUrlStore';
  import axios from 'axios';

  let modalVisible = false;
  let notification = { message: "", type: "", show: false };
  let baseURL = "";

  // Form fields
  let mrn = "";
  let govIdType = "DL";
  let govIdFull = "Driver licence number";
  let govIdNum = "";
  let firstName = "";
  let lastName = "";
  let gender = "male";
  let birthDate = "";
  let email = "";
  let phone = "";

  baseUrlStore.subscribe((value) => {
    baseURL = value;
    localStorage.setItem("baseUrl", baseURL);
  });

  function openModal() {
    modalVisible = true;
  }

  function closeModal() {
    modalVisible = false;
  }

  const createPatient = async () => {
    const newPatient = {
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
          value: mrn,
        },
        {
          type: {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/v2-0203",
                code: govIdType,
                display: govIdFull,
              },
            ],
          },
          value: govIdNum,
        },
      ],
      name: [
        {
          given: [firstName],
          family: lastName,
          use: "usual",
        },
      ],
      gender,
      birthDate,
      telecom: [
        {
          system: "email",
          value: email,
        },
        {
          system: "phone",
          value: phone,
        },
      ],
    };

    try {
      await axios.post(`${baseURL}/Patient`, newPatient);
      // Assuming fetchPatients is defined somewhere to refresh the patient list
      // fetchPatients();
      closeModal();
      notification = { message: "Patient added successfully", type: "success", show: true };
      setTimeout(() => notification.show = false, 3000); // Hide notification after 3 seconds
    } catch (error) {
      console.error("Error adding patient:", error);
      notification = { message: "Error adding patient", type: "error", show: true };
      setTimeout(() => notification.show = false, 3000); // Hide notification after 3 seconds
    }
  };

  function handleSubmit(event) {
    event.preventDefault();
    createPatient();
  }
</script>

<div class="p-4">
  <!-- <h2 class="text-xl mb-4 font-bold">SEARCH PATIENT</h2>
  <form class="grid grid-cols-2 gap-4" on:submit|preventDefault={handleSubmit}>
    <div class="flex items-center">
      <input
        type="text"
        placeholder="Search here"
        class="mt-1 p-1 w-full h-[5vh] border border-gray-300 rounded"
      />
    </div>
    <div class="flex items-center">
      <Button color="blue" class="!p-2"><SearchOutline class="w-6 h-6" /></Button>
    </div>
      <div class="flex items-center">
      <Button type="button" color='red' on:click={openModal} >
        <PlusOutline class="w-6 h-6" />
        <span class="ml-2">Add Patient</span>
      </Button>
    </div>
  
  </form> -->
  <h2 class="text-xl mb-4 font-bold">SEARCH PATIENT</h2>
<div class="flex justify-between items-center mb-4">
  <form class="flex gap-4 w-[30vh]">
    <div class="flex items-center w-[30vw]">
      <input
        type="text"
        placeholder="Search here"
        class="mt-1 p-1 w-[30vw] h-[5vh] border border-gray-300 rounded"
      />
    </div>
    <div class="flex items-center">
      <Button color="blue" class="!p-2">
        <SearchOutline class="w-6 h-6" />
      </Button>
    </div>
  </form>
  <div class="flex items-center">
    <Button type="button" color='red' on:click={openModal}>
      <PlusOutline class="w-6vw h-6vh" />
      <span class="ml-2">Add Patient</span>
    </Button>
  </div>
</div>



  <Modal title="Create New Patient" bind:open={modalVisible} autoclose={false}>
    <form class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">MRN:</label>
        <input
          type="text"
          placeholder="MRN"
          bind:value={mrn}
          class="mt-1 p-2 w-full border border-gray-300 rounded"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Government Identifier Type:</label>
        <select bind:value={govIdType} class="mt-1 p-2 w-full border border-gray-300 rounded">
          <option value="DL">Driver licence number (DL)</option>
          <option value="BCT">Birth Certificate (BCT)</option>
          <option value="CZ">Citizenship Card (CZ)</option>
          <option value="HC">Health Card Number (HC)</option>
          <option value="NI">National unique individual identifier (NI)</option>
          <option value="SS">Social Security Number (SS)</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Government Identifier Number:</label>
        <input
          type="text"
          bind:value={govIdNum}
          placeholder="Government Identifier Number"
          class="mt-1 p-2 w-full border border-gray-300 rounded"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">First Name:</label>
        <input
          type="text"
          bind:value={firstName}
          placeholder="First Name"
          class="mt-1 p-2 w-full border border-gray-300 rounded"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Last Name:</label>
        <input
          type="text"
          placeholder="Last Name"
          bind:value={lastName}
          class="mt-1 p-2 w-full border border-gray-300 rounded"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Date of Birth:</label>
        <input
          type="date"
          bind:value={birthDate}
          class="mt-1 p-2 w-full border border-gray-300 rounded"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Gender:</label>
        <select bind:value={gender} class="mt-1 p-2 w-full border border-gray-300 rounded">
          <option value="male">male</option>
          <option value="female">female</option>
          <option value="other">other</option>
          <option value="unknown">unknown</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Email:</label>
        <input
          type="text"
          placeholder="Email"
          bind:value={email}
          class="mt-1 p-2 w-full border border-gray-300 rounded"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Phone:</label>
        <input
          type="text"
          placeholder="Phone"
          bind:value={phone}
          class="mt-1 p-2 w-full border border-gray-300 rounded"
        />
      </div>
    </form>
    <svelte:fragment slot="footer">
      <Button color="green" on:click={createPatient}>Create Patient</Button>
      <Button color="alternative" on:click={closeModal}>Cancel</Button>
    </svelte:fragment>
  </Modal>

  {#if notification.show}
    <div class={`fixed bottom-4 right-4 px-4 py-2 bg-${notification.type === "success" ? "green" : "red"}-500 text-white rounded`}>
      {notification.message}
    </div>
  {/if}
</div>
