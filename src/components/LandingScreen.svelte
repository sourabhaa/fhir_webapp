<script>
  import PatientForm from "./PatientForm.svelte";
  import PatientList from "./PatientList.svelte";
</script>

<div>
  <main class="flex-1 p-8 flex flex-col">
    <PatientForm />
    <div class="patient-list-container flex-1 overflow-y-auto mt-4">
      <PatientList />
    </div>
  </main>
</div>
