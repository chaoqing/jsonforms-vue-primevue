<script setup lang="ts"></script>

<template>
  <div class="home-container">
    <div class="home-content">
      <h1 class="welcome-title">
        Welcome to JSON Forms Vue 3 PrimeVue
      </h1>
      <h2 class="tagline">More Forms. Less Code.</h2>

      <p class="description">
        For help and collaboration with other JSON Forms developers,
        <br />please join our online
        <a href="https://jsonforms.discourse.group" target="_blank"
          >Discourse Community</a
        >
      </p>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 2rem;
}

.home-content {
  text-align: center;
  max-width: 600px;
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: var(--text-color);
}

.tagline {
  font-size: 1.75rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  color: var(--text-color);
}

.description {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-color-secondary);
  margin: 0;
}

.description a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
}

.description a:hover {
  text-decoration: underline;
}
</style>
