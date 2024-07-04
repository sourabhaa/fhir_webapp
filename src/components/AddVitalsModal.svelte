<script>
  import { onMount } from 'svelte';
  import { v4 as uuidv4 } from 'uuid'; // Importing the UUID function
  import { createEventDispatcher } from 'svelte';
  import { Toast, Button } from 'flowbite-svelte'; // Import Flowbite Toast component
  import { patientStore } from "./../stores/patientStore";
  import { baseUrlStore } from '../stores/baseUrlStore';
  import { get } from 'svelte/store';

  const dispatch = createEventDispatcher();
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

  let guid;
  let recordedDateTime;
  let vitals = {
    weight: '',
    height: '',
    temperature: '',
    respirationRate: '',
    pulseRate: '',
    oxygenSaturation: '',
    systolicBP: '',
    diastolicBP: ''
  };

  const vitalsInfo = {
    weight: { displayName: 'Weight', code: '29463-7', unit: 'kgs' },
    height: { displayName: 'Height', code: '8302-2', unit: 'cm' },
    temperature: { displayName: 'Body Temperature', code: '8310-5', unit: '°C' },
    respirationRate: { displayName: 'Respiratory Rate', code: '9279-1', unit: 'breaths/min' },
    pulseRate: { displayName: 'Heart Rate', code: '8867-4', unit: 'beats/min' },
    oxygenSaturation: { displayName: 'Oxygen Saturation', code: '59408-5', unit: '%' }
  };

  // Generate GUID and timestamp when the component is mounted
  onMount(() => {
    guid = uuidv4(); // Generate a new GUID
    recordedDateTime = new Date().toISOString(); // Get the current timestamp
  });

  // Function to close the modal
  const closeModal = () => {
    dispatch('close');
  };

  function handleInputChange(e, field) {
    const value = e.target.value;
    if (isValidNumber(value)) {
      vitals[field] = value;
    }
  }

  function isValidNumber(value) {
    // Check if the value is a valid number, including decimal points
    const regex = /^\d*\.?\d*$/;
    return regex.test(value) || value === '';  // Allow empty string for initial state
  }

  async function saveVitals() {
    if ((vitals.systolicBP && !vitals.diastolicBP) || (!vitals.systolicBP && vitals.diastolicBP)) {
      alert('Please fill both Systolic and Diastolic Blood Pressure or leave them both empty.');
      return;
    }

    const patientReference = `Patient/${patient.id}`;
    const requests = [];

    for (const [key, info] of Object.entries(vitalsInfo)) {
      if (vitals[key]) {
        const payload = {
          resourceType: "Observation",
          subject: {
            reference: patientReference
          },
          identifier: [
            {
              system: "http://mini-ehr.com/vital-signs",
              value: guid
            }
          ],
          category: [
            {
              coding: [
                {
                  system: "http://hl7.org/fhir/ValueSet/observation-category",
                  code: "vital-signs"
                }
              ]
            }
          ],
          code: {
            coding: [
              {
                system: "http://loinc.org/",
                code: info.code,
                display: info.displayName
              }
            ]
          },
          effectiveDateTime: recordedDateTime,
          valueQuantity: {
            value: parseFloat(vitals[key]),
            unit: info.unit
          }
        };

        requests.push(sendRequest(payload));
      }
    }

    if (vitals.systolicBP && vitals.diastolicBP) {
      const bpPayload = {
        resourceType: "Observation",
        subject: {
          reference: patientReference
        },
        identifier: [
          {
            system: "http://mini-ehr.com/vital-signs",
            value: guid
          }
        ],
        category: [
          {
            coding: [
              {
                system: "http://hl7.org/fhir/ValueSet/observation-category",
                code: "vital-signs"
              }
            ]
          }
        ],
        code: {
          coding: [
            {
              system: "http://loinc.org/",
              code: "35094-2",
              display: "Blood pressure panel"
            }
          ]
        },
        effectiveDateTime: recordedDateTime,
        component: [
          {
            code: {
              coding: [
                {
                  system: "http://loinc.org",
                  code: "8480-6",
                  display: "Systolic blood pressure"
                }
              ]
            },
            valueQuantity: {
              value: parseFloat(vitals.systolicBP),
              unit: "mmHg"
            }
          },
          {
            code: {
              coding: [
                {
                  system: "http://loinc.org",
                  code: "8462-4",
                  display: "Diastolic blood pressure"
                }
              ]
            },
            valueQuantity: {
              value: parseFloat(vitals.diastolicBP),
              unit: "mmHg"
            }
          }
        ]
      };

      requests.push(sendRequest(bpPayload));

      
    }
    closeModal(); // Close the modal after saving
  //   try {
  //   await Promise.all(requests);
  //   console.log("dispatched vitalsave")
  //   dispatch('vitalsSaved'); // Dispatch a custom event after saving vitals
  //   closeModal(); // Close the modal after saving
  // } catch (error) {
  //   console.error('Fetch error:', error);
  //   alert(`Error: ${error.message}`);
  // }

  }
  let baseURL = '';
  baseUrlStore.subscribe(value => {
    baseURL = value;
  });

  // const baseURL = import.meta.env.VITE_BASE_URL;
  async function sendRequest(payload) {
    const response = await fetch(`${baseURL}/Observation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error('Failed to save vital');
    }
  }

  function showToast(message, type) {
    Toast({
      title: message,
      icon: type === 'success' ? 'check-circle' : 'exclamation-circle',
      timeout: 1000
    });
  }
</script>

<!-- Modal backdrop -->
<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
  <!-- Modal container with fixed height and scrollable content -->
  <div class="bg-main-bg p-8 rounded-2xl w-11/12 max-w-3xl max-h-[90vh] shadow-lg relative overflow-auto">
    <!-- Close button -->
    <button class=" absolute top-4 right-4 text-gray-500 hover:text-accent-red" on:click={closeModal}>
      &times;
    </button>

    <!-- Modal Header -->
    <h2 class="text-3xl font-bold mb-8">Add Vitals</h2>

    <!-- Section 1: Document Identifier and Recorded DateTime -->
    <div class="mb-8">
      <label class="block font-semibold mb-2">Document Identifier</label>
      <input type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 bg-gray-100" value={guid} readonly />

      <label class="block font-semibold mb-2">Recorded DateTime</label>
      <input type="text" class="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100" value={recordedDateTime} readonly />
    </div>

    <!-- Section 2: Vitals Inputs -->
    <div class="mb-8">
      <h3 class="text-xl font-semibold mb-4">Vitals</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {#each Object.keys(vitalsInfo) as key}
          <div>
            <label class="block font-semibold mb-2">{vitalsInfo[key].displayName} ({vitalsInfo[key].unit})</label>
            <input
              type="number"
              step="any"
              class="w-full border border-gray-300 rounded-lg px-4 py-2"
              bind:value={vitals[key]}
              on:input={(e) => handleInputChange(e, key)}
              pattern="[0-9]*\.?[0-9]*"
            />
          </div>
        {/each}
      </div>
    </div>

    <!-- Section 3: Blood Pressure Inputs -->
    <div class="mb-8">
      <h3 class="text-xl font-semibold mb-4">Blood Pressure</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block font-semibold mb-2">Systolic (mmHg)</label>
          <input type="number" step="any" class="w-full border border-gray-300 rounded-lg px-4 py-2"
            bind:value={vitals.systolicBP} on:input={(e) => handleInputChange(e, 'systolicBP')} />
        </div>
        <div>
          <label class="block font-semibold mb-2">Diastolic (mmHg)</label>
          <input type="number" step="any" class="w-full border border-gray-300 rounded-lg px-4 py-2"
            bind:value={vitals.diastolicBP} on:input={(e) => handleInputChange(e, 'diastolicBP')} />
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="flex justify-end space-x-4">
      <Button outline color="red"
      class="mx-4" on:click={saveVitals}>Save</Button>
      <Button outline color="dark"
      class="mx-4" on:click={closeModal}>Cancel</Button>
    </div>
  </div>
</div>

<style>
  input:invalid {
    border-color: red;
  }
</style> 