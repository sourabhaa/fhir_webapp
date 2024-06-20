<script>
  import {
    HomeOutline,
    PlusOutline,
    FileCheckOutline,
    UserOutline,
    LandmarkOutline,
  } from "flowbite-svelte-icons";
  import { Button, Modal } from "flowbite-svelte";
  import { Accordion, AccordionItem } from "flowbite-svelte";
  import { tick } from "svelte";
  let notification = { message: "", type: "", show: false };
  let modalVisible = false;
  import axios from "axios";
  import { fetchPatients } from "../stores/patientStore.js";
  import { navigate } from "svelte-routing";
  const dispatch = createEventDispatcher();
  import { createEventDispatcher } from "svelte";

  function goToHome() {
    navigate("/");
  }

  // Modal action buttons
  function openModal() {
    modalVisible = true;
  }

  function closeModal() {
    modalVisible = false;
  }
  // success notification post creation
  const handleNotify = (event) => {
    notification = { ...event.detail, show: true };
    tick().then(() => {
      setTimeout(() => {
        notification.show = false;
      }, 1000);
    });
  };

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
    const baseURL = import.meta.env.VITE_BASE_URL;
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
    console.log("newPatient UPDATED: ", newPatient);
  };
</script>

<aside class="bg-sidebar-bg w-full h-full p-4 text-gray-700 rounded-l-xl">
  <div class="logo mb-6 font-black">LOGO</div>
  <nav>
    <ul>
      <li class="mb-4">
        <a
          href="#"
          class="flex items-center"
        >
          <FileCheckOutline class="w-6 h-6" />
          <span class="ml-2">Master</span>
        </a>
      </li>
      <li class="mb-4 ml-2">
        <a
          href="#"
          class="flex items-center"
        >
          <LandmarkOutline class="w-6 h-6" />
          <span class="ml-2">Hospital</span>
        </a>
      </li>
      <li class="mb-4 ml-2">
        <a
          href="#"
          class="flex items-center"
        >
          <UserOutline class="w-6 h-6" />
          <span class="ml-2">Doctor</span>
        </a>
      </li>
    </ul>
    <ul>
      <li class="mb-4">
        <a
          href="/"
          class="flex items-center"
          on:click={goToHome}
        >
          <HomeOutline class="w-6 h-6" />
          <span class="ml-2">Home</span>
        </a>
      </li>
      <li>
        <button
          on:click={openModal}
          class="flex items-center"
        >
          <PlusOutline class="w-6 h-6" />
          <span class="ml-2">Add Patient</span>
        </button>
      </li>
    </ul>
  </nav>
  <Modal
    title="Create New Patient"
    bind:open={modalVisible}
    autoclose
  >
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
        <label class="block text-sm font-medium text-gray-700"
          >Government Identifier Type:</label
        >
        <select
          bind:value={govIdType}
          class="mt-1 p-2 w-full border border-gray-300 rounded"
        >
          <option>Driver licence number (DL)</option>
          <option>Birth Certificate (BCT)</option>
          <option>Citizenship Card (CZ)</option>
          <option>Health Card Number (HC)</option>
          <option>National unique individual identifier (NI)</option>
          <option>Social Security Number (SS)</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700"
          >Government Identifier Number:</label
        >
        <input
          type="text"
          bind:value={govIdNum}
          placeholder="Government Identifier Number"
          class="mt-1 p-2 w-full border border-gray-300 rounded"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700"
          >First Name:</label
        >
        <input
          type="text"
          bind:value={firstName}
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
          bind:value={lastName}
          class="mt-1 p-2 w-full border border-gray-300 rounded"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700"
          >Date of Birth:</label
        >
        <input
          type="date"
          bind:value={birthDate}
          class="mt-1 p-2 w-full border border-gray-300 rounded"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Gender:</label>
        <select
          bind:value={gender}
          class="mt-1 p-2 w-full border border-gray-300 rounded"
        >
          <option>male</option>
          <option>female</option>
          <option>other</option>
          <option>unknown</option>
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
  {/if}
</aside>

<style>
  .button:hover {
    color: #ee4d38;
  }
</style>
