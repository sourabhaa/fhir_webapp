<script>
  import DoctorForm from "./DoctorForm.svelte";
  import DoctorList from "./DoctorList.svelte";
</script>

<div>
  <main class="flex-1 p-8 flex flex-col">
    <DoctorForm />
    <div class="patient-list-container flex-1 overflow-y-auto mt-4">
      <DoctorList />
    </div>
  </main>
</div>
