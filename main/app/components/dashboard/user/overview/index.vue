<template>
    <section class="users-overview">
        <div class="header">
            <div class="title-wrapper flex-row">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M18 21a8 8 0 0 0-16 0"/><circle cx="10" cy="8" r="5"/><path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"/></g></svg>
                <h2>All site users</h2>
            </div>
        </div>

        <div class="content">
            <div class="users-wrapper flex-col">
                <DashboardUserAdminOverview :users="adminUsers" showRole title="Admins" />
                <DashboardUserClinicianOverview :users="clinicianUsers" showRole title="Clinicians" />
                <DashboardUserPatientOverview :users="patientUsers" showRole title="Patients" />
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
const {
    adminUsers,
    clinicianUsers,
    patientUsers
} = await useUsers();

console.log(adminUsers.value, clinicianUsers, patientUsers);
</script>

<style lang="scss" scoped>
.title-wrapper {
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0rem;
    margin-bottom: 1.5rem;

    h2 {
        font-size: 1.25rem;
        font-weight: 500;
    }

    svg {
        width: 1.25rem;
        height: 1.25rem;
    }
}

.users-wrapper {
    gap: 2rem;
}
</style>