<template>
  <div class="container section" style="display:grid; place-items:center; min-height:70vh">
    <UiCard style="width:min(520px, 100%)">
      <div class="stack">
        <div>
          <h2>Crie sua Conta</h2>
          <p class="field-hint">Comece agora na FluxoPronto.</p>
        </div>
        <form class="stack" @submit.prevent="onSubmit">
          <UiInput v-model="name" label="Nome" placeholder="Seu nome" />
          <UiInput v-model="email" label="Email" type="email" placeholder="seuemail@exemplo.com" />
          <UiInput v-model="password" label="Senha" type="password" placeholder="********" />
          <label class="field">
            <span class="field-label">Concordo com os Termos</span>
            <input type="checkbox" v-model="agree" />
          </label>
          <button class="btn btn-gradient btn-lg" type="submit" :disabled="loading">{{ loading ? "Loading..." : "Criarconta" }}</button>
        </form>
        <div class="auth-card-footer">
          <NuxtLink class="hover-underline" to="/auth/login">Já tenho conta</NuxtLink>
        </div>
      </div>
    </UiCard>
  </div>
</template>

<script setup>
import UiCard from '@/components/ui/UiCard.vue'
import UiInput from '@/components/ui/UiInput.vue'
import UiButton from '@/components/ui/UiButton.vue'
import { useAuthRedirect } from '@/composables/useAuthRedirect'

const supabase = useSupabaseClient()
const router = useRouter()
const { handlePostLoginRedirect } = useAuthRedirect()

const name = ref('')
const email = ref('')
const password = ref('')
const agree = ref(false)
const loading = ref(false)

async function onSubmit() {
  loading.value = true
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      data: {
        name: name.value,
        cpf_cnpj: '',
        role: 'user'
      }
    }
  })
  loading.value = false
  if (!error) {
    const result = handlePostLoginRedirect()
    if (!result) router.push('/marketplace')
  }
}
</script>

<style scoped>
/* globais */
</style>
