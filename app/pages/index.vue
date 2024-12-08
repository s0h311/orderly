<template>
  <section>
    <div>
      <button @click="signIn('github')">Signin with Github</button>
      <button @click="signIn('google')">Signin with Google</button>

      <button @click="signOut()">Sign Out</button>
    </div>

    <div>
      <pre>{{ status }}</pre>
      <pre>{{ data?.user }}</pre>
      <pre>{{ data?.expires }}</pre>
    </div>

    <div>
      <button @click="checkout">CHECKOUT</button>
    </div>

    <div>
      <input
        type="email"
        v-model="email"
      />

      <button @click="signIn('magic-link', { email, callbackUrl: '/' })">Send magic link</button>
    </div>
  </section>
</template>

<script setup lang="ts">
const { signIn, signOut, status, data } = useAuth()

const email = ref<string>('')

async function checkout(): Promise<void> {
  const checkoutUrl = await $fetch('api/stripe/checkout', {
    method: 'post',
    body: {
      priceId: 'price_1PSPTTKDXBGuYX0kpVOpSB6t',
    },
  })

  await navigateTo(checkoutUrl, { external: true })
}
</script>

<style scoped>
section {
  display: grid;
  gap: 40px;
}

div {
  display: flex;
  gap: 20px;
}
</style>
