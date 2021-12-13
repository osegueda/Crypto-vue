<template>
  <table>
    <thead>
      <tr class="bg-gray-100 border-b-2 border-gray-400">
        <th></th>
        <th
          v-bind:class="{ up: this.sortOrder == 1, down: this.sortOrder == -1 }"
        >
          <span class="underline cursor-pointer" v-on:click="changeSortOrder"
            >Ranking</span
          >
        </th>
        <th>Nombre</th>
        <th>Precio</th>
        <th>Cap. de Mercado</th>
        <th>Variación 24hs</th>
        <td class="hidden sm:block">
          <input
            class="bg-gray-100 focus:outline-none border-b border-gray-400 py-2 px-4 block w-full appearance-none leading-normal"
            id="filter"
            placeholder="Buscar..."
            type="text"
            v-model="filter"
          />
        </td>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="c in filteredAssets"
        :key="c.id"
        class="border-b border-gray-200 hover:bg-gray-100 hover:bg-orange-100"
      >
        <td>
          <img
            class="w-6 h-6"
            :src="`https://static.coincap.io/assets/icons/${c.symbol.toLowerCase()}@2x.png`"
            :alt="c.name"
            srcset=""
          />
        </td>
        <td>
          <b>#{{ c.rank }} </b>
        </td>
        <td>
          <router-link
            class="hover:underline text-gray-600"
            :to="{ name: 'coin-detail', params: { id: c.id } }"
          >
            {{ c.name }}
          </router-link>
          <small class="ml-1 text-gray-500">{{ c.symbol }} </small>
        </td>
        <td>{{ c.priceUsd | dollar }}</td>
        <td>{{ c.marketCapUsd | dollar }}</td>
        <td
          :class="
            c.changePercent24Hr.includes('-')
              ? 'text-red-600'
              : 'text-green-600'
          "
        >
          {{ c.changePercent24Hr | percent }}
        </td>
        <td class="hidden sm:block">
          <px-button @custom-click="goToCoin(c.id)">
            <span>Detalle</span>
          </px-button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import PxButton from "@/components/PxButton";

export default {
  name: "PxAssetsTable",
  components: { PxButton },
  data() {
    return {
      filter: "",
      sortOrder: 1,
    };
  },
  props: {
    assets: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    filteredAssets() {
      /*if (!this.filter) {
        return this.assets;
      }*/
      const altOrder = this.sortOrder == 1 ? -1 : 1;
      return this.assets
        .filter(
          (a) =>
            a.symbol.toLowerCase().includes(this.filter.toLowerCase()) ||
            a.name.toLowerCase().includes(this.filter.toLowerCase())
        )
        .sort((a, b) => {
          if (parseInt(a.rank) > parseInt(b.rank)) {
            return this.sortOrder; //ascendente 1
          }
          return altOrder; //descendente -1
        });
    },
  },
  methods: {
    goToCoin(id) {
      //existen dos objetos $router y $routes ambos diferentes
      //este lo ocupamos para acceder a la instancia del router y navegar a travez de codigo
      this.$router.push({ name: "coin-detail", params: { id } }); //empujamos una nueva ruta dentro del stack de rutas
    },
    changeSortOrder() {
      this.sortOrder = this.sortOrder == 1 ? -1 : 1;
    },
  },
};
</script>

<style scoped>
.up::before {
  content: "👆";
}

.down::before {
  content: "👇";
}

td {
  padding: 20px 0px;
  font-size: 0.6rem;
  text-align: center;
}

th {
  padding: 5px;
  font-size: 0.6rem;
}

@media (min-width: 640px) {
  td,
  th {
    padding: 20px;
    font-size: 1rem;
  }

  th {
    padding: 12px;
  }
}
</style>
