<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { ref, onMounted } from 'vue';
import { ProductService } from "./service/ProductService.js";
import Masthead from "./components/Masthead.vue";

onMounted(() => {
    ProductService.getProductsMini().then((data: any) => (products.value = data));
});

const products = ref();

</script>

<template>
  <Masthead />

  <div class="card">
        <DataTable :value="products" tableStyle="min-width: 50rem">
            <Column field="nom" header="Nom du tarif" sortable ></Column>
            <Column field="tarif" header="Type de tarif" sortable ></Column>
            <Column field="zone" header="Zone de livraison" sortable ></Column>
            <Column field="delai" header="Délai de livraison" sortable ></Column>
            <Column field="colis" header="Type de colis" sortable ></Column>
            <Column field="status" header="Statut" sortable ></Column>
            <Column field="freeshipping" header="Livraison gratuite" sortable ></Column>
        </DataTable>
    </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
