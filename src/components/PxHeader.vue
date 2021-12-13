<template>
  <header class="shadow w-screen">
    <nav>
      <nav class="flex items-center justify-between bg-gray-700 p-6">
        <div class="flex items-center flex-shrink-0 text-white mr-6">
          <!--<px-icon class="mr-2" /> -->
          <img :src="image" class="h-10 mr-2" />
          <router-link
            :to="{ name: 'home' }"
            class="font-semibold text-xl tracking-tight"
            >CriptoExchange</router-link
          >
        </div>
        <div
          class="hidden sm:block w-full blok flex-grow lg:flex lg:items-center lg:wauto"
        >
          <div class="text-sm flex lg:flex-grow">
            <router-link
              v-for="l in links"
              :key="l.title"
              :to="l.to"
              class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4"
            >
              {{ l.title }}</router-link
            >
          </div>
        </div>
      </nav>
    </nav>
  </header>
</template>

<script>
//import PxIcon from "@/components/PxIcon";
import image from "../assets/exchange.png";
export default {
  name: "PxHeader",
  //components: { PxIcon },
  data() {
    return {
      image: image,
    };
  },

  props: {
    links: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
