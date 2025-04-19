<template>
  <form
    @submit.prevent="handleSubmit"
    class="bg-white dark:bg-gray-800 rounded w-full max-w-lg space-y-4 mb-8 transition-colors"
  >
    <h2 class="text-xl font-bold mb-2 text-gray-800 dark:text-white">
      {{ props.client ? "Edit Client" : "Add New Client" }}
    </h2>

    <input
      v-model="name"
      type="text"
      placeholder="Name"
      required
      class="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-white rounded transition"
    />
    <input
      v-model="email"
      type="email"
      placeholder="Email"
      class="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-white rounded transition"
    />
    <input
      v-model="phone"
      type="text"
      placeholder="Phone"
      class="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-white rounded transition"
    />
    <input
      v-model="company"
      type="text"
      placeholder="Company"
      class="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-white rounded transition"
    />
    <textarea
      v-model="notes"
      placeholder="Notes"
      rows="3"
      class="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-white rounded transition resize-none"
    ></textarea>

    <button
      type="submit"
      class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
    >
      {{ props.client ? "Update Client" : "Add Client" }}
    </button>
  </form>
</template>

<script setup>
import { ref, watch } from "vue";
import axios from "axios";
import { useToast } from "vue-toastification";

const props = defineProps({ client: Object });
const emit = defineEmits(["updated", "reset"]);

const name = ref("");
const email = ref("");
const phone = ref("");
const company = ref("");
const notes = ref("");

const toast = useToast();

const handleSubmit = async () => {
  const token = localStorage.getItem("token");
  const clientData = {
    name: name.value,
    email: email.value,
    phone: phone.value,
    company: company.value,
    notes: notes.value,
  };

  try {
    if (props.client && props.client._id) {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/clients/${props.client._id}`,
        clientData,
        {
          headers: { Authorization: token },
        }
      );
    } else {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/clients`,
        clientData,
        {
          headers: { Authorization: token },
        }
      );
    }

    toast.success(
      `Client ${props.client ? "updated" : "created"} successfully!`
    );
    emit("updated");
    emit("reset");
    resetForm();
  } catch (err) {
    toast.error(err.response?.data?.message || "Error saving client");
  }
};

const resetForm = () => {
  name.value = "";
  email.value = "";
  phone.value = "";
  company.value = "";
  notes.value = "";
};

watch(
  () => props.client,
  (newClient) => {
    if (newClient) {
      name.value = newClient.name || "";
      email.value = newClient.email || "";
      phone.value = newClient.phone || "";
      company.value = newClient.company || "";
      notes.value = newClient.notes || "";
    } else {
      resetForm();
    }
  },
  { immediate: true }
);
</script>
