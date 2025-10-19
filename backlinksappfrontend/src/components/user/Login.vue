<script setup>
import LoginForm from './LoginForm.vue'
</script>

<template>
  <div class="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
    <div class="row w-100 align-items-center">
      
      <!-- Left side: Backlinks illustration -->
      <div class="col-md-6 d-none d-md-flex justify-content-center align-items-center">
        <img
          src="@/assets/images/BacklinksImage.png"
          alt="Backlinks Illustration"
          class="img-fluid w-75"
        />
      </div>

      <!-- Right side: Login card -->
      <div class="col-md-6 d-flex justify-content-center align-items-center">
        <div class="card shadow-sm w-75 rounded">
          <div class="card-body">
            <h2 class="h2 text-center mb-4">Login to your account</h2>
            <LoginForm />
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
