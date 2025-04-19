<template>
  <header
    class="bg-gray-100 dark:bg-gray-900 py-4 px-6 shadow-md mb-6 transition"
  >
    <div class="flex justify-between items-center max-w-6xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Mini CRM</h1>
      <button
        @click="toggleDarkMode"
        class="flex items-center gap-2 text-sm px-4 py-2 rounded transition bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        <span v-if="isDark">🌙 Dark Mode</span>
        <span v-else>☀️ Light Mode</span>
      </button>
    </div>
  </header>

  <main class="max-w-6xl mx-auto px-4 py-8 transition">
    <div class="grid gap-8 lg:grid-cols-2">
      <!-- FORM -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow transition">
        <ClientForm
          :client="selectedClient"
          @updated="fetchClients"
          @reset="selectedClient = null"
        />
      </div>

      <!-- CLIENT LIST -->
      <div>
        <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Your Clients
        </h2>

        <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>

        <ul v-if="clients.length" class="space-y-4">
          <li
            v-for="client in clients"
            :key="client._id"
            class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-lg transition"
          >
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ client.name }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              📧 {{ client.email || "—" }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              📞 {{ client.phone || "—" }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              🏢 {{ client.company || "—" }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              📝 {{ client.notes || "—" }}
            </p>

            <div class="mt-4 flex gap-4">
              <button
                @click="selectClient(client)"
                class="text-blue-600 dark:text-blue-400 text-sm hover:underline"
              >
                ✏️ Edit
              </button>
              <button
                @click="deleteClient(client._id)"
                class="text-red-600 dark:text-red-400 text-sm hover:underline"
              >
                🗑️ Delete
              </button>
            </div>
          </li>
        </ul>

        <div
          v-else
          class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center text-gray-500 dark:text-gray-300"
        >
          <p>
            You haven’t added any clients yet. Start by filling out the form!
          </p>
        </div>
      </div>
    </div>

    <!-- LOGOUT -->
    <div class="flex justify-end mt-8">
      <button
        @click="logout"
        class="bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-600 font-medium px-4 py-2 rounded transition"
      >
        Logout
      </button>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import ClientForm from "../components/ClientForm.vue";
import { useToast } from "vue-toastification";

const clients = ref([]);
const error = ref(null);
const router = useRouter();
const selectedClient = ref(null);
const toast = useToast();
const isDark = ref(false);

const logout = () => {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }
};

const selectClient = (client) => {
  selectedClient.value = { ...client };
};

const fetchClients = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/clients`,
      {
        headers: { Authorization: token },
      }
    );
    clients.value = res.data;
  } catch (err) {
    error.value = err.response?.data?.message || "Error fetching clients";
  }
};

const deleteClient = async (id) => {
  if (!confirm("Delete this client?")) return;

  const token = localStorage.getItem("token");
  try {
    await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/clients/${id}`, {
      headers: { Authorization: token },
    });
    fetchClients();
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to delete client");
  }
};

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle("dark", isDark.value);
  localStorage.setItem("theme", isDark.value ? "dark" : "light");
};

onMounted(() => {
  const savedTheme = localStorage.getItem("theme");
  isDark.value = savedTheme === "dark";

  document.documentElement.classList.toggle("dark", isDark.value);

  const token = localStorage.getItem("token");
  if (!token) return router.push("/login");

  fetchClients();
});
</script>
