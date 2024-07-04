<script>
  import Sidebar from "./components/Sidebar.svelte";
  import { Router, Route } from "svelte-routing";
  // import PatientForm from "./components/PatientForm.svelte";
  // import PatientList from "./components/PatientList.svelte";
  import LandingScreen from "./components/LandingScreen.svelte";
  // import PatientDetail from "./components/PatientDetail.svelte";
  import { fetchPatients } from "./stores/patientStore.js";
  import { onMount } from "svelte";
  import PatientVitals from "./components/PatientVitals.svelte";
  import LabServices from "./components/LabServices.svelte";
  import DoctorsScreen from "./components/DoctorsScreen.svelte";
  import ServiceRequest from "./components/ServiceRequest.svelte";
  import SelectServer from "./components/SelectServer.svelte";
  import MedicationMaster from "./components/MedicationMaster.svelte";

  onMount(() => {
    fetchPatients();
  });
</script>

<div class="bg-base-layer h-screen w-screen relative">
  <div
    class="absolute left-red-rect-right top-red-rect-top w-sidebar h-red-rectangle bg-accent-red rounded-2xl ml-6 mt-5"
  ></div>
  <div
    class="absolute left-main-right top-main-top w-main-content h-main-screen bg-main-bg rounded-3xl shadow-lg flex overflow-hidden ml-14 mt-10"
  >
  
    <div class="w-sidebar bg-sidebar-bg rounded-l-xl p-4 top-main-top">
      <Sidebar />
    </div>
    <main class="flex-1 p-8 flex flex-col">
      <Router>
        <Route
          path="/"
          component={SelectServer}
        />
        <Route
          path="/patientList"
          component={LandingScreen}
        />
        <Route
          path="/patient/:id/vitals"
          component={PatientVitals}
        />
        <Route
          path="/master/labServices"
          component={LabServices}
        />
        <Route
          path="/master/doctor"
          component={DoctorsScreen}
        />
    
        <Route
        path="/master/medicationsList"
        component={MedicationMaster}
      />

      <Route
          path="/patient/:id/serviceRequest"
          component={ServiceRequest}
        />
      </Router>
    </main>
  </div>
</div>