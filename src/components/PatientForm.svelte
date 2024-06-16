<script>
  import { Button } from "flowbite-svelte";
  import { SearchOutline } from "flowbite-svelte-icons";
</script>

<div class="p-4">
  <h2 class="text-xl mb-4 font-bold">SEARCH PATIENT</h2>
  <form class="grid grid-cols-2 gap-4">
    <div class="flex items-center">
      <input
        type="text"
        placeholder="Search here"
        class="mt-1 p-1 w-full h-[5vh] border border-gray-300 rounded"
      />
    </div>
    <div class="flex items-center">
      <Button
        color="blue"
        class="!p-2"><SearchOutline class="w-6 h-6" /></Button
      >
    </div>
  </form>
</div>

<style>
  label {
    min-width: 10vh; /* Adjust as needed to align the labels */
  }
</style>
