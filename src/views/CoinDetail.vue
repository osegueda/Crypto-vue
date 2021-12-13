<template>
  <div class="flex-col">
    <div class="flex justify-center">
      <bounce-loader :loading="isLoading" :color="'#64748b'" :size="100" />
    </div>
    <template v-if="!isLoading">
      <div class="flex flex-col sm:flex-row justify-around items-center">
        <div class="flex flex-col items-center">
          <img
            :src="`https://static.coincap.io/assets/icons/${asset.symbol.toLocaleLowerCase()}@2x.png`"
            :alt="asset.name"
            class="w-20 h-20 mr-5"
          />
          <h1 class="text-5xl">
            {{ asset.name }}
            <small class="sm:mr-2 text-gray-500">{{ asset.symbol }} </small>
          </h1>
        </div>

        <div class="my-10 flex flex-col">
          <ul>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Ranking</b>
              <span>#{{ asset.rank }} </span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio actual</b>
              <span>{{ asset.priceUsd | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más bajo</b>
              <span>{{ min | dollar }} </span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio más alto</b>
              <span>{{ max | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Precio Promedio</b>
              <span>{{ avg | dollar }}</span>
            </li>
            <li class="flex justify-between">
              <b class="text-gray-600 mr-10 uppercase">Variación 24hs</b>
              <span>{{ asset.changePercent24Hr | percent }}</span>
            </li>
          </ul>
        </div>

        <div
          class="my-10 sm:mt-0 pl-2 flex flex-col justify-center text-center"
        >
          <button
            @click="toggleConverter"
            class="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            {{ fromUsd ? `USD a ${asset.symbol}` : `${asset.symbol} a USD` }}
          </button>

          <div class="flex flex-row my-5">
            <label class="w-full" for="convertValue">
              <input
                v-model="convertValue"
                id="convertValue"
                type="number"
                class="text-center bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
                :placeholder="`Valor en ${fromUsd ? 'USD' : asset.symbol}`"
              />
            </label>
          </div>

          <span class="text-xl"
            >{{ convertResult }} {{ fromUsd ? asset.symbol : `USD` }}
          </span>
        </div>
      </div>
      <line-chart
        class="my-10"
        :colors="['orange']"
        :min="min"
        :max="max"
        :data="dataChart"
      />

      <h3 class="text-xl my-10">Mejores Ofertas de Cambio</h3>
      <table>
        <tr
          v-for="m in markets"
          :key="`${m.exchanged}-${m.priceUsd}`"
          class="border-b"
        >
          <td>
            <b>{{ m.exchangeId }}</b>
          </td>
          <td>{{ m.priceUsd | dollar }}</td>
          <td>{{ m.baseSymbol }} / {{ m.quoteSymbol }}</td>
          <td>
            <px-button
              :isLoading="m.isLoading || false"
              v-if="!m.url"
              @custom-click="getWebsite(m)"
            >
              <slot>Obtener Link</slot>
            </px-button>
            <a
              v-else
              class="hover:underline font-medium text-yellow-600"
              target="_blanck"
            >
              {{ m.url }}
            </a>
          </td>
        </tr>
      </table>
    </template>
  </div>
</template>
<script>
import PxButton from "../components/PxButton.vue";
import api from "@/api";
export default {
  name: "CoinDetail",
  components: { PxButton },
  data() {
    return {
      isLoading: false,
      asset: {},
      history: [],
      markets: [],
      fromUsd: true,
      convertValue: null,
    };
  },
  computed: {
    convertResult() {
      if (!this.convertValue) {
        return 0;
      }

      const result = this.fromUsd
        ? this.convertValue / this.asset.priceUsd
        : this.convertValue * this.asset.priceUsd;

      return result.toFixed(2);
    },
    //Math.min/max() devuelven el menor y el mayor
    //numero de cero o mas elementos numericos de un array po ejemplo
    min() {
      return Math.min(
        ...this.history.map((h) => parseFloat(h.priceUsd).toFixed(2))
      );
    },
    max() {
      return Math.max(
        ...this.history.map((h) => parseFloat(h.priceUsd).toFixed(2))
      );
    },
    avg() {
      return (
        this.history.reduce((a, b) => a + parseFloat(b.priceUsd), 0) /
        this.history.length
      );
    },
    dataChart() {
      return this.history.map((h) => [
        h.date,
        parseFloat(h.priceUsd).toFixed(2),
      ]);
    },
  },
  /*watch: {
    //Asi cada vez que la ruta sea cambiada en $route el watcher se ejecute
    $route() {
      this.getCoin;
    },
  },*/
  beforeRouteUpdate(to, from, next) {
    next();
    this.getCoin();
  },
  created() {
    this.getCoin();
  },
  methods: {
    toggleConverter() {
      this.fromUsd = !this.fromUsd;
    },
    getWebsite(exchange) {
      this.$set(exchange, "isLoading", true);
      return api
        .getExchange(exchange.exchangeId)
        .then((res) => {
          //exchange.url = res.exchangeUrl; (asi no cambia)
          //$Set en objetos o array Para arreglar problema de reactividad cuando se añade una nueva propiedad url al array
          // (Objeto, Nombrepropiedad, valorPropiedad )
          this.$set(exchange, "url", res.exchangeUrl);
        })
        .finally(() => {
          this.$set(exchange, "isLoading", false);
        });
    },
    getCoin() {
      //con el $route podemos acceder al url de la ruta y su string en este caso
      //params.id
      const id = this.$route.params.id;
      this.isLoading = true;
      //utilizamos promise .all ya que en este metodo realizamos dos llamados a la api
      //en este caso getAsset y AssetHistory para extraer el historial
      Promise.all([
        api.getAsset(id),
        api.getAssetHistory(id),
        api.getMarkets(id),
      ])
        .then(([asset, history, markets]) => {
          this.asset = asset;
          this.history = history;
          this.markets = markets;
        })
        .finally(() => (this.isLoading = false));
    },
  },
};
</script>
<style scoped>
td {
  padding: 10px;
  text-align: center;
}
</style>
