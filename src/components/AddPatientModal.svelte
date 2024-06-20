<!-- <script>
  import {
    Button,
    Modal,
    Input,
    Dropdown,
    DropdownItem,
  } from "flowbite-svelte";
  import { createEventDispatcher } from "svelte";
  import axios from "axios";
  import { fetchPatients } from "../stores/patientStore.js";

  const baseURL = "http://localhost:8081/fhir";

  export let open = false; // Declare open as a prop
  const dispatch = createEventDispatcher();

  let mrn = "";
  let govIdType = "DL";
  let firstName = "";
  let lastName = "";
  let gender = "male";
  let birthDate = "";
  let email = "";
  let phone = "";

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
              },
            ],
          },
          value: govIdType,
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
      fetchPatients(); // Refresh patient list
      dispatch("close");
      dispatch("notify", {
        message: "Patient added successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Error adding patient:", error);
      dispatch("notify", { message: "Error adding patient", type: "error" });
    }
  };
</script>

<Modal
  title="Create New Patient"
  bind:open
>
  <div class="space-y-4">
    <form class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700"
          >First Name:</label
        >
        <input
          type="text"
          placeholder="First Name"
          class="mt-1 p-2 w-full border border-gray-300 rounded"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Last Name:</label
        >
        <input
          type="text"
          placeholder="Last Name"
          class="mt-1 p-2 w-full border border-gray-300 rounded"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700"
          >Date of Birth:</label
        >
        <input
          type="date"
          class="mt-1 p-2 w-full border border-gray-300 rounded"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Gender:</label>
        <select class="mt-1 p-2 w-full border border-gray-300 rounded">
          <option>Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Email:</label>
        <input
          type="text"
          placeholder="Email"
          class="mt-1 p-2 w-full border border-gray-300 rounded"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Phone:</label>
        <input
          type="text"
          placeholder="Phone"
          class="mt-1 p-2 w-full border border-gray-300 rounded"
        />
      </div>
    </form>
  </div>
  <svelte:fragment slot="footer">
    <Button
      on:click={createPatient}
      color="blue">Create Patient</Button
    >
    <Button
      color="alternative"
      on:click={() => dispatch("close")}>Cancel</Button
    >
  </svelte:fragment>
</Modal>

<!-- <script>
  import {
    Button,
    Modal,
    Input,
    Dropdown,
    DropdownItem,
  } from "flowbite-svelte";
  import { createEventDispatcher } from "svelte";
  import { tick } from "svelte";
  import axios from "axios";
  import { fetchPatients } from "../stores/patientStore.js";

  let notification = { message: "", type: "", show: false };
  let modalVisible = false;

  const dispatch = createEventDispatcher();

  // Form fields
  let mrn = "";
  let govIdType = "DL";
  let govIdNum = "";
  let firstName = "";
  let lastName = "";
  let gender = "male";
  let birthDate = "";
  let email = "";
  let phone = "";

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
    const baseURL = "http://localhost:8081/fhir";
    try {
      await axios.post(`${baseURL}/Patient`, newPatient);
      fetchPatients(); // Refresh patient list
      closeModal();
      notification = {
        message: "Patient added successfully",
        type: "success",
        show: true,
      };
      await tick();
      setTimeout(() => {
        notification.show = false;
      }, 1000);
    } catch (error) {
      console.error("Error adding patient:", error);
      notification = {
        message: "Error adding patient",
        type: "error",
        show: true,
      };
      await tick();
      setTimeout(() => {
        notification.show = false;
      }, 1000);
    }
  };

  function openModal() {
    modalVisible = true;
  }

  function closeModal() {
    modalVisible = false;
  }
</script>

<Modal
  title="Create New Patient"
  bind:open={modalVisible}
  autoclose
>
  <form class="grid grid-cols-2 gap-4">
    <div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700"
          >Government Identifier Type:</label
        >
        <select
          bind:value={govIdType}
          class="mt-1 p-2 w-full border border-gray-300 rounded"
        >
          <option>Driver's licence number (DL)</option>
          <option>Birth Certificate (BCT)</option>
          <option>Citizenship Card (CZ)</option>
          <option>Health Card Number (HC)</option>
          <option>National unique individual identifier (NI)</option>
          <option>Social Security Number (SS)</option>
        </select>
      </div>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700"
        >Government Identifier Number:</label
      >
      <Input
        type="text"
        placeholder="Government Identifier Number"
        bind:value={govIdNum}
        class="mt-1 p-2 w-full border border-gray-300 rounded"
      />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">First Name:</label>
      <Input
        type="text"
        placeholder="First Name"
        bind:value={firstName}
        class="mt-1 p-2 w-full border border-gray-300 rounded"
      />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Last Name:</label>
      <Input
        type="text"
        placeholder="Last Name"
        bind:value={lastName}
        class="mt-1 p-2 w-full border border-gray-300 rounded"
      />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">MRN:</label>
      <Input
        type="text"
        placeholder="MRN"
        bind:value={mrn}
        class="mt-1 p-2 w-full border border-gray-300 rounded"
      />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700"
        >Date of Birth:</label
      >
      <Input
        type="date"
        bind:value={birthDate}
        class="mt-1 p-2 w-full border border-gray-300 rounded"
      />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Gender:</label>
      <div>
        <label class="block text-sm font-medium text-gray-700">Gender:</label>
        <select
          bind:value={gender}
          class="mt-1 p-2 w-full border border-gray-300 rounded"
        >
          <option>Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
          <option>Unknown</option>
        </select>
      </div>
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Email:</label>
      <Input
        type="text"
        placeholder="Email"
        bind:value={email}
        class="mt-1 p-2 w-full border border-gray-300 rounded"
      />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Phone:</label>
      <Input
        type="text"
        placeholder="Phone"
        bind:value={phone}
        class="mt-1 p-2 w-full border border-gray-300 rounded"
      />
    </div>
  </form>
  <svelte:fragment slot="footer">
    <Button
      color="green"
      on:click={createPatient}>Create Patient</Button
    >
    <Button
      color="alternative"
      on:click={closeModal}>Cancel</Button
    >
  </svelte:fragment>
</Modal>

{#if notification.show}
  <div
    class={`fixed bottom-4 right-4 px-4 py-2 bg-${notification.type === "success" ? "green" : "red"}-500 text-white rounded`}
  >
    {notification.message}
  </div>
{/if} -->
