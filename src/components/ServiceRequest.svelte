<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";
  import { Modal } from "flowbite-svelte";
  import { v4 as uuidv4 } from 'uuid'; //use short uuid
  import { baseUrlStore } from "../stores/baseUrlStore";
  import axios from "axios";
  import { patientStore } from "../stores/patientStore";

  const dispatch = createEventDispatcher();
  let patientName = "John Doe"; // This should be fetched from the patientStore
  let modalVisible = false;
  let requestId = "";
  let orderingDoctor = "";
  let doctors = [];
  let orders = [];
  let labServices = [];

  onMount(async () => {
    patientStore.subscribe(value => {
      if (value) {
        patientName = value.name; // Get patient name from patientStore
      }
    });
    await fetchDoctors();
    await fetchLabServices();
  });

  async function fetchDoctors() {
 
// Subscribe to the baseUrlStore to get the current baseUrl
let baseURL = "";
baseUrlStore.subscribe((value) => {
  baseURL = value;
  // Optional: You can also store the baseURL in local storage here
  localStorage.setItem("baseUrl", baseURL);
});
    // const baseURL = import.meta.env.VITE_BASE_URL;
    try {
      const response = await axios.get(`${baseURL}/Practitioner`);
      doctors = response.data.entry.map(entry => ({
        name: entry.resource.name[0].text,
        role: entry.resource.qualification[0].code.coding[0].display
      }));
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  }

  async function fetchLabServices() {
    // Fetch lab services from lab_services.json
    try {
      const response = await axios.get('/lab_services.json');
      labServices = response.data;
    } catch (error) {
      console.error("Error fetching lab services:", error);
    }
  }

  function openModal() {
    requestId = uuidv4();
    modalVisible = true;
  }

  function closeModal() {
    modalVisible = false;
  }

  function addNewOrder() {
    orders = [...orders, { orderId: uuidv4(), investigation: "", status: "active" }];
  }

  function deleteOrder(index) {
    orders = orders.filter((_, i) => i !== index);
  }

  async function saveLabRequest() {
    const baseURL = import.meta.env.VITE_BASE_URL;
    const bundle = {
      resourceType: "Bundle",
      type: "transaction",
      entry: orders.map(order => ({
        resource: {
          resourceType: "ServiceRequest",
          requisition: {
            system: "http://miniehr.com/lab-request",
            value: requestId
          },
          identifier: [{
            system: "http://miniehr.com/lab-order",
            value: order.orderId
          }],
          status: "completed",
          intent: "original-order",
          category: [{
            coding: [{
              system: "http://hl7.org/fhir/ValueSet/servicerequest-category",
              code: "108252007",
              display: "Laboratory procedure"
            }]
          }],
          code: {
            coding: [{
              system: "http://loinc.org",
              code: order.investigation,
              display: labServices.find(service => service.serviceName === order.investigation)?.serviceName || order.investigation
            }]
          },
          subject: { reference: "Patient/3" },
          requester: { reference: "Practitioner/2" }
        },
        request: { method: "POST" }
      }))
    };
    try {
      await axios.post(`${baseURL}/`, bundle);
      dispatch("notify", { message: "Lab request saved successfully", type: "success" });
      closeModal();
    } catch (error) {
      console.error("Error saving lab request:", error);
      dispatch("notify", { message: "Error saving lab request", type: "error" });
    }
  }
</script>

<aside class="bg-sidebar-bg w-full h-full p-4 text-gray-700 rounded-l-xl">
  <div class="flex justify-between items-center">
    <h1 class="text-xl font-bold">Service Request Listing</h1>
    <button on:click={openModal} class="bg-blue-500 text-white px-4 py-2 rounded">New Lab Request</button>
  </div>

  <table class="min-w-full mt-6 bg-white shadow-md rounded-lg">
    <thead>
      <tr class="bg-gray-200">
        <th class="py-2 px-4">ID</th>
        <th class="py-2 px-4">Request ID</th>
        <th class="py-2 px-4">Lab Test Name</th>
        <th class="py-2 px-4">Status</th>
        <th class="py-2 px-4">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="py-2 px-4">1</td>
        <td class="py-2 px-4">12345</td>
        <td class="py-2 px-4">CBC</td>
        <td class="py-2 px-4">Pending</td>
        <td class="py-2 px-4">
          <button class="text-blue-500">Edit</button>
          <button class="text-red-500 ml-2">Delete</button>
        </td>
      </tr>
    </tbody>
  </table>

  <Modal title={`Add lab request for ${patientName}`} bind:open={modalVisible} autoclose>
    <form class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Request ID:</label>
        <input type="text" readonly bind:value={requestId} class="mt-1 p-2 w-full border border-gray-300 rounded" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Ordering Doctor:</label>
        <select bind:value={orderingDoctor} class="mt-1 p-2 w-full border border-gray-300 rounded">
          {#each doctors as doctor}
            <option value={doctor.name}>{doctor.name} - {doctor.role}</option>
          {/each}
        </select>
      </div>
      <div>
        <table class="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr class="bg-gray-200">
              <th class="py-2 px-4">Order ID</th>
              <th class="py-2 px-4">Investigation</th>
              <th class="py-2 px-4">Status</th>
              <th class="py-2 px-4">Delete</th>
            </tr>
          </thead>
          <tbody>
            {#each orders as order, index}
              <tr>
                <td class="py-2 px-4">{order.orderId}</td>
                <td class="py-2 px-4">
                  <select bind:value={order.investigation} class="w-full border border-gray-300 rounded">
                    {#each labServices as service}
                      <option value={service.serviceName}>{service.serviceName}</option>
                    {/each}
                  </select>
                </td>
                <td class="py-2 px-4">{order.status}</td>
                <td class="py-2 px-4">
                  <button on:click={() => deleteOrder(index)} class="text-red-500">Delete</button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
        <button on:click={addNewOrder} class="mt-2 bg-green-500 text-white px-4 py-2 rounded">Add New Order</button>
      </div>
      <div class="flex justify-end space-x-4">
        <button type="button" on:click={saveLabRequest} class="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
        <button type="button" on:click={closeModal} class="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
      </div>
    </form>
  </Modal>
</aside>

<style>
  .button:hover {
    color: #ee4d38;
  }
</style>
