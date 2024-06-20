
<script lang="ts">
  import { onMount } from "svelte";
  // import { location } from "svelte-spa-router";
  import { Input, Button } from "flowbite-svelte";
  import { getContext } from "svelte";
  import { patientStore } from "./../stores/patientStore";
  import { hasContext } from "svelte";
  import { PlusOutline } from "flowbite-svelte-icons";
  // Base URL for the API
  const baseURL = import.meta.env.VITE_BASE_URL;

  // Patient and Vitals data structures

 
  let patient = {
    id: "",
    name: "",
    birthDate: "",
    gender: "",
  };

  $: patientStore.subscribe((value) => {
    if (value && Object.keys(value).length > 0) {
      patient = value;
      console.log("Current patient details in PatientDetail: ", patient);
    } else {
      console.log("No patient selected.");
    }
  });

  
  let vitals = {
    bodyWeight: "",
    bloodPressure: "",
    height: "",
    pulse: "",
    temperature: "",
    oxygenSaturation: "",
    bmi: "",
    respirationRate: "",
  };

  // Function to update a vital sign and send a POST request
  async function updateVitalAndPost(vitalName, value) {
    // Update the local state
    vitals[vitalName] = value;

    // Prepare Observation resource object
    const observation = {
      resourceType: "Observation",
      status: "final",
      category: [
        {
          coding: [
            {
              system:
                "http://terminology.hl7.org/CodeSystem/observation-category",
              code: "vital-signs",
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: "http://loinc.org",
            code: getVitalCode(vitalName),
            display: getDisplayText(vitalName),
          },
        ],
      },
      subject: {
        reference: `Patient/${patient.id}`,
      },
      valueQuantity: {
        value,
        unit: getUnit(vitalName),
        system: "http://unitsofmeasure.org",
        code: getUnit(vitalName),
      },
    };

    // Send POST request to the FHIR server
    try {
      const response = await fetch(`${baseURL}/Observation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(observation),
      });
      if (response.ok) {
        console.log(`Successfully updated ${vitalName} observation.`);
      } else {
        console.error(
          `Failed to update ${vitalName} observation. Status: ${response.status}`
        );
      }
    } catch (error) {
      console.error(`Error updating ${vitalName} observation:`, error);
    }
  }

  // Helper function to get display text for each vital sign
  function getDisplayText(vitalName) {
    switch (vitalName) {
      case "bodyWeight":
        return "Body Weight";
      case "bloodPressure":
        return "Blood Pressure";
      case "height":
        return "Height";
      case "pulse":
        return "Pulse";
      case "temperature":
        return "Temperature";
      case "oxygenSaturation":
        return "Oxygen saturation in Arterial blood";
      case "bmi":
        return "BMI";
      case "respirationRate":
        return "Respiration Rate";
      default:
        return "";
    }
  }

  // Helper function to get unit for each vital sign
  function getUnit(vitalName) {
    switch (vitalName) {
      case "bodyWeight":
        return "kg";
      case "bloodPressure":
        return "mmHg";
      case "height":
        return "cm";
      case "pulse":
        return "/min";
      case "temperature":
        return "Cel";
      case "oxygenSaturation":
        return "%";
      case "bmi":
        return "";
      case "respirationRate":
        return "/min";
      default:
        return "";
    }
  }

  function getVitalCode(vitalName) {
    switch (vitalName) {
      case "bodyWeight":
        return "29463-7";
      case "bloodPressure":
        return "85354-9";
      case "height":
        return "8302-2";
      case "pulse":
        return "8867-4";
      case "temperature":
        return "8310-5";
      case "oxygenSaturation":
        return "2708-6";
      case "bmi":
        return "39156-5";
      case "respirationRate":
        return "9279-1";
      default:
        return "";
    }
  }

  // Function to fetch patient vitals
  async function fetchPatientVitals() {
    try {
      const response = await fetch(
        `${baseURL}/Observation?patient=${patient.id}&category=vital-signs`
      );
      const data = await response.json();

      // Check if there are entries in the response
      if (data.entry) {
        // Map over the entries to set the respective vital signs
        data.entry.forEach((item) => {
          const display = item.resource.code.coding[0].display;
          const value = item.resource.valueQuantity?.value;

          // Update vitals based on fetched data
          switch (display) {
            case "Body Weight":
              vitals.bodyWeight = value;
              break;
            case "Blood Pressure":
              vitals.bloodPressure = value;
              break;
            case "Height":
              vitals.height = value;
              break;
            case "Pulse":
              vitals.pulse = value;
              break;
            case "Temperature":
              vitals.temperature = value;
              break;
            case "Oxygen saturation in Arterial blood":
              vitals.oxygenSaturation = value;
              break;
            case "BMI":
              vitals.bmi = value;
              break;
            case "Respiration Rate":
              vitals.respirationRate = value;
              break;
            default:
              break;
          }
        });
      }
    } catch (error) {
      console.error("Error fetching patient vitals:", error);
    }
  }

  // On component mount, fetch the patient data and vitals
  onMount(async () => {
      console.log("2");
      console.log("patient in details: ", patient);
      await fetchPatientVitals();
    // }
  });
</script>

<!-- Main Container -->
<div class="bg-main-bg p-8 lg:p-12 xl:p-16 rounded-2xl min-w-6xl h-screen mx-auto">
  <!-- Patient Header -->
  <div class="bg-accent-red text-white p-6 lg:p-8 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
    <div>
      <h2 class="text-3xl lg:text-4xl xl:text-5xl font-bold">{patient.name}</h2>
      <p>ID: {patient.id}</p>
    </div>
    <div class="mt-4 md:mt-0 text-left md:text-right">
      <p>Date of Birth: {patient.birthDate}</p>
      <p>Gender: {patient.gender}</p>
    </div>
  </div>

  <!-- Vitals Section -->
  <h3 class="text-2xl lg:text-3xl font-semibold my-10 lg:my-12">VITALS</h3>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
    {#each [
      { label: 'Body Weight', key: 'bodyWeight', placeholder: 'Body Weight' },
      { label: 'Blood Pressure', key: 'bloodPressure', placeholder: 'Blood Pressure' },
      { label: 'Height', key: 'height', placeholder: 'Height' },
      { label: 'Pulse', key: 'pulse', placeholder: 'Pulse' },
      { label: 'Temperature', key: 'temperature', placeholder: 'Temperature' },
      { label: 'Oxygen Saturation', key: 'oxygenSaturation', placeholder: 'Oxygen Saturation' },
      { label: 'BMI', key: 'bmi', placeholder: 'BMI' },
      { label: 'Respiration Rate', key: 'respirationRate', placeholder: 'Respiration Rate' },
    ] as vital}
      <div class="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
        <label class="font-semibold w-full lg:w-40">{vital.label}:</label>
        <input
          class="border rounded-lg p-2 w-full lg:flex-grow h-10"
          type="text"
          bind:value={vitals[vital.key]}
          placeholder={vital.placeholder}
          on:input={(event) => (vitals[vital.key] = event.target.value)}
        />
        <Button
          outline
          size='xs'
          color="red"
          class="mt-2 lg:mt-0 py-2 px-4 rounded-lg"
          on:click={() => updateVitalAndPost(vital.key, vitals[vital.key])}
        >
          <PlusOutline class="w-4 h-4 me-1" /> Add
        </Button>
      </div>
    {/each}
  </div>
</div>

<!-- Styling the grid and elements based on the screenshot -->
<style>
  .rounded-2xl {
    border-radius: 2.8125rem; /* Custom border radius as defined in tailwind.config.js */
  }
</style>
