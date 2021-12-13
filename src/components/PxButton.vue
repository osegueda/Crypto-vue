<template>
  <button
    v-on:click="buttonClick"
    class="bg-transparent hover:bg-gray-800 text-gray-700 font-semibold hover:text-white py-2 px-2 border border-gray-500 hover:border-transparent rounded"
  >
    <beat-loader v-bind:loading="isLoading" :color="'#475569'" :size="8" />
    <p v-show="!isLoading">
      <slot></slot>
    </p>
  </button>
</template>

<script>
export default {
  name: "PxButton",
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  //para el v-on:click podemos ocupar el @click y tenemos un shorthand
  methods: {
    buttonClick() {
      //con emit se agregan eventos vacios desde el hijo para llenarlos y ejecutarlos en el padre
      this.$emit("custom-click");
    },
  },
};
</script>
