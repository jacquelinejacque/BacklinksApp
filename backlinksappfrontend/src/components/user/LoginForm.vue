<script>
import { Const } from '@/utils/constants'
import { Toast } from 'bootstrap/dist/js/bootstrap.bundle'
import axios from 'axios'

export default {
  data() {
    return {
      Const,
      formData: {
        username: 'joy@example.com',
        password: 'password123',
        recaptchaToken: ''
      },
      loading: false,
      toastElement: null,
      recaptchaWidgetId: null // 👈 track widget ID to prevent re-render
    }
  },

  mounted() {
    this.toastElement = new Toast(document.getElementById('login-toast'))

    // If grecaptcha already loaded
    if (window.grecaptcha && window.grecaptcha.render) {
      this.renderRecaptcha()
    } else {
      // Load script if not loaded
      window.onRecaptchaLoadCallback = this.renderRecaptcha
      if (!document.querySelector('script[src*="recaptcha/api.js"]')) {
        const script = document.createElement('script')
        script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoadCallback&render=explicit'
        script.async = true
        script.defer = true
        document.head.appendChild(script)
      }
    }
  },

  methods: {
    renderRecaptcha() {
      const container = document.querySelector('.g-recaptcha')

      // 🧠 Prevent re-rendering the same container
      if (!container || !window.grecaptcha) {
        console.error('reCAPTCHA not available yet.')
        return
      }

      if (this.recaptchaWidgetId !== null) {
        // Already rendered, just reset it
        window.grecaptcha.reset(this.recaptchaWidgetId)
        return
      }

      // Render once and store widget ID
      this.recaptchaWidgetId = window.grecaptcha.render(container, {
        sitekey: this.Const.RECAPTCHA_SITE_KEY,
        callback: this.handleRecaptchaSuccess
      })
    },

    handleRecaptchaSuccess(token) {
      console.log('✅ reCAPTCHA token received:', token)
      this.formData.recaptchaToken = token
    },

    showToastMessage(message) {
      const toastEl = document.getElementById('login-toast')
      toastEl.querySelector('.toast-body').textContent = message
      this.toastElement.show()
    },

    async handleSubmit() {
      try {
        this.loading = true
        if (!this.formData.recaptchaToken) {
          this.showToastMessage('Please complete the reCAPTCHA')
          this.loading = false
          return
        }

        console.log('📤 Sending to backend:', this.formData)
        const res = await axios.post(`${this.Const.BASE_URL}/users/login`, this.formData)

        if (res.data?.status !== 200) throw new Error(res.data.error || 'Unexpected error')

        localStorage.setItem('accessToken', res.data.jwtToken)
        localStorage.setItem('userID', res.data?.user?.userID)

        this.$router.push('/billinvoice/users/list-users')
      } catch (error) {
        console.error(error)
        this.showToastMessage('Invalid Credentials')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="mx-auto" style="max-width: 400px;">
    <div class="mb-3">
      <label class="form-label">Email address</label>
      <input type="text" class="form-control" v-model="formData.username" placeholder="your@email.com" required />
    </div>

    <div class="mb-3">
      <label class="form-label">Password</label>
      <input type="password" class="form-control" v-model="formData.password" placeholder="Your password" required />
    </div>

    <div class="mb-3">
      <label class="form-label d-block">Security Check</label>
      <div class="g-recaptcha" :data-sitekey="Const.RECAPTCHA_SITE_KEY"></div>
    </div>

    <div class="form-footer">
      <button type="submit" class="btn btn-primary w-100">
        <span v-if="loading">Signing in...</span>
        <span v-else>Sign in</span>
      </button>
    </div>

    <div class="text mt-3">
      <span>Don't have an account? </span>
      <a href="#" class="text-primary fw-bold text-decoration-none">Sign Up</a>
    </div>
  </form>

  <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
    <div id="login-toast" class="toast align-items-center bg-danger text-white border-0">
      <div class="d-flex">
        <div class="toast-body"></div>
        <button type="button" class="btn-close btn-close-white ms-auto me-2"></button>
      </div>
    </div>
  </div>
</template>
