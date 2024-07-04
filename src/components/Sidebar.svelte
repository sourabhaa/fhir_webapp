<script>
  import {
    HomeOutline,
    PlusOutline,
    FileCheckOutline,
    UserOutline,
    LandmarkOutline,
  } from "flowbite-svelte-icons";
  import { Accordion, AccordionItem } from "flowbite-svelte";
  import { navigate } from "svelte-routing";
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import { patientStore } from "../stores/patientStore";
  import { get } from 'svelte/store';

  const dispatch = createEventDispatcher();
  let patientId;
  let currentLocation = window.location.pathname;

  onMount(() => {
    // Update patientId from patientStore
    patientStore.subscribe(value => {
      patientId = value.id;
    });

    // Update currentLocation on history changes
    const updateLocation = () => {
      currentLocation = window.location.pathname;
    };

    window.addEventListener('popstate', updateLocation);

    return () => {
      window.removeEventListener('popstate', updateLocation);
    };
  });

  // Function to navigate to a new path and update currentLocation
  function navigateTo(path) {
    navigate(path);
    currentLocation = path;
  }

  function goToHome(event) {
    event.preventDefault();
    navigateTo("/patientList");
  }

  // Determine if the current path matches the given path
  function isActive(path) {
    return currentLocation.startsWith(path);
  }
  function isActiveFirst(path) {
    // const firstPart = currentLocation.split('/')[1]; // Getting the first part of the path after the initial '/'
    return currentLocation === path;
  }

  // Ensure patientId is fetched from patientStore on reload
  $: patientId = get(patientStore).id;
</script>

<aside class="bg-sidebar-bg w-full h-full p-4 text-gray-700 rounded-l-xl">
  <div class="logo mb-6 font-black">LOGO</div>
  <nav>
    <ul>
      <li class="my-4">
        <a
          href="/patientList"
          class="flex items-center {isActive('/patientList') ? 'text-blue-500' : ''}"
          on:click={goToHome}
        >
          <HomeOutline class="w-6 h-6" />
          <span class="ml-2">Home</span>
        </a>
      </li>

      <Accordion class='ml-2' flush>
        <AccordionItem class='ml-2'>
          <span class='ml-2' slot="header">Patient</span>
          <ul>
            <li class="mb-4 ml-2">
              <a href={`/patient/${patientId}/vitals`} class="flex items-center {isActive(`/patient/${patientId}/vitals`) ? 'text-blue-500' : ''}">
                <FileCheckOutline class="w-6 h-6" />
                <span class="ml-2">Vitals</span>
              </a>
            </li>
            <li class="mb-4 ml-2">
              <a href={`/patient/${patientId}/labRequest`} class="flex items-center {isActive(`/patient/${patientId}/labRequest`) ? 'text-blue-500' : ''}">
                <FileCheckOutline class="w-6 h-6" />
                <span class="ml-2">Lab Request</span>
              </a>
            </li>
            <li class="mb-4 ml-2">
              <a href={`/patient/${patientId}/observationList`} class="flex items-center {isActive(`/patient/${patientId}/observationList`) ? 'text-blue-500' : ''}">
                <FileCheckOutline class="w-6 h-6" />
                <span class="ml-2">Observation List</span>
              </a>
            </li>
            <li class="my-4 ml-2">
              <a href={`/patient/${patientId}/medOrders`} class="flex items-center {isActive(`/patient/${patientId}/medOrders`) ? 'text-blue-500' : ''}">
                <FileCheckOutline class="w-6 h-6" />
                <span class="ml-2">Med Orders</span>
              </a>
            </li>
          </ul>
        </AccordionItem>
      </Accordion>


      <!-- {/if} -->
      <Accordion class='ml-2' flush>
        <AccordionItem class='ml-2'>
          <span class='ml-2' slot="header">Master</span>
          <ul>
            <li class="mb-4 ml-2">
              <a href="/master/labServices" class="flex items-center">
                <LandmarkOutline class="w-6 h-6" />
                <span class="ml-2">Lab Services</span>
              </a>
            </li>
            <li class="mb-4 ml-2">
              <a href="/master/doctor" class="flex items-center">
                <UserOutline class="w-6 h-6" />
                <span class="ml-2">Doctor</span>
              </a>
            </li>
            <li class="mb-4 ml-2">
              <a href="/master/medicationsList" class="flex items-center">
                <FileCheckOutline class="w-6 h-6" />
                <span class="ml-2">Medications List</span>
              </a>
            </li>
          </ul>
        </AccordionItem>
      </Accordion>
    </ul>
  </nav>
</aside>

<style>
  .button:hover {
    color: #ee4d38;
  }
</style>