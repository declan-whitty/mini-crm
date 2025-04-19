<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <form
      @submit.prevent="handleLogin"
      class="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-sm"
    >
      <h2 class="text-2xl font-bold mb-4 text-center text-gray-700">Login</h2>

      <div class="mb-4">
        <label class="block text-gray-600 text-sm font-bold mb-2">Email</label>
        <input
          v-model="email"
          type="email"
          required
          class="w-full px-3 py-2 border rounded"
        />
      </div>

      <div class="mb-4">
        <label class="block text-gray-600 text-sm font-bold mb-2"
          >Password</label
        >
        <input
          v-model="password"
          type="password"
          required
          class="w-full px-3 py-2 border rounded"
        />
      </div>

      <p v-if="error" class="text-red-500 text-sm mb-4">{{ error }}</p>

      <button
        type="submit"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Login
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const email = ref("");
const password = ref("");
const error = ref(null);
const router = useRouter();

const handleLogin = async () => {
  console.log("Sending", email.value, password.value);
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
      {
        email: email.value,
        password: password.value,
      }
    );

    // Save token to localStorage
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    // Redirect to dashboard
    router.push("/dashboard");
  } catch (err) {
    error.value = err.response?.data?.message || "Login failed";
  }
};
</script>
