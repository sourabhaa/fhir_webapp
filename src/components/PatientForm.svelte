<script>
  // Form logic if any
</script>

<div class="p-4">
  <h2 class="text-xl mb-4 font-bold">SELECT PATIENT</h2>
  <form class="grid grid-cols-2 gap-4">
    <div>
      <label class="block text-sm font-medium text-gray-700">First Name:</label>
      <input
        type="text"
        placeholder="First Name"
        class="mt-1 p-2 w-full border border-gray-300 rounded"
      />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700">Last Name:</label>
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
  </form>
</div>
