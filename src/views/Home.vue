<template>
  <div>
    <bounce-loader :loading="isLoading" :color="'#64748b'" :size="100" />
    <!--Aqui le mandamos por parametro v-bind(:assets ="assets" o v-bind:assets="assets") el array de data al componente de la tabla-->
    <px-assets-table v-if="!isLoading" v-bind:assets="assets" />
  </div>
</template>

<script>
import api from "@/api";
import PxAssetsTable from "@/components/PxAssetsTable";
//Aqui vienen primero el array asset del archivo api
export default {
  name: "Home",

  components: { PxAssetsTable },

  data() {
    return {
      isLoading: false,
      assets: [], //Caen y se rellena aqui
    };
  },
  //Pero antes que se llene se hace la paeticion del metodo para llenarlo
  created() {
    this.isLoading = true;
    api
      .getAssets()
      .then((assets) => (this.assets = assets))
      .finally(() => (this.isLoading = false));
  },
};
</script>
