<script>
  import { onMount } from "svelte";
  import { baseUrlStore } from '../stores/baseUrlStore';
  import { navigate } from "svelte-routing";

  let servers = [];
  let selectedServer = null;
  let serverName = '';
  let baseUrl = '';
  let authType = '';
  const authTypes = ['OAuth', 'Basic', 'Token'];

  onMount(async () => {
    const response = await fetch('src/assets/servers.json');
    const data = await response.json();
    servers = data.servers;

    // Fetch the baseUrl from local storage if available and update the store
    const storedBaseUrl = localStorage.getItem('baseUrl');
    if (storedBaseUrl) {
      baseUrlStore.set(storedBaseUrl);
    }
  });

  function handleServerChange(event) {
    selectedServer = servers.find(server => server.name === event.target.value);
    if (selectedServer) {
      serverName = selectedServer.name;
      baseUrl = selectedServer.baseUrl;
      authType = selectedServer.authType;
    }
  }

  function proceed() {
    // Store the selected baseUrl in the Svelte store and local storage
    baseUrlStore.set(baseUrl);
    localStorage.setItem('baseUrl', baseUrl);

    console.log('Proceeding with:', { serverName, baseUrl, authType });
    // Navigate to LandingScreen (Assuming you have a router setup)
    navigate('/patientList');
  }
</script>

<aside class="bg-sidebar-bg w-full h-full p-4 text-gray-700 rounded-l-xl">
  <h1 class="text-2xl font-bold mb-6">Select Server</h1>
  <div class="space-y-4">
    <div>
      <label for="select-server" class="block text-sm font-medium text-gray-700">Select Server</label>
      <select id="select-server" on:change="{handleServerChange}" class="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        <option value="">-- Select a Server --</option>
        {#each servers as server}
          <option value="{server.name}">{server.name}</option>
        {/each}
      </select>
    </div>
    <div>
      <label for="server-name" class="block text-sm font-medium text-gray-700">Server Name</label>
      <input type="text" id="server-name" bind:value="{serverName}" readonly class="mt-1 block w-full p-2 bg-gray-200 border border-gray-300 rounded-md shadow-sm sm:text-sm" />
    </div>
    <div>
      <label for="base-url" class="block text-sm font-medium text-gray-700">Base URL</label>
      <input type="text" id="base-url" bind:value="{baseUrl}" readonly class="mt-1 block w-full p-2 bg-gray-200 border border-gray-300 rounded-md shadow-sm sm:text-sm" />
    </div>
    <div>
      <label for="auth-type" class="block text-sm font-medium text-gray-700">Auth Type</label>
      <select id="auth-type" bind:value="{authType}" class="mt-1 block w-full p-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        {#each authTypes as type}
          <option value="{type}">{type}</option>
        {/each}
      </select>
    </div>
    <button on:click="{proceed}" class="w-full py-2 px-4 bg-accent-red text-white font-semibold rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
      Proceed
    </button>
  </div>
</aside>

<style>
  .button:hover {
    color: #ee4d38;
  }
</style>
