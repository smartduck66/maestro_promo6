<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import { ref, onMounted } from "vue";
import { ProductService } from "./service/ProductService.js";
import Masthead from "./components/Masthead.vue";

const visible = ref(false); // Gestion de la visibilité de la zone de création d'un nouveau tarif

onMounted(() => {
  ProductService.getProductsMini().then((data: any) => (products.value = data));
});

const products = ref();
</script>

<template>
  <Masthead />

  <div class="card">
    <DataTable :value="products" tableStyle="min-width: 50rem">
      <Column field="nom" header="Nom du tarif" sortable></Column>
      <Column field="tarif" header="Type de tarif" sortable></Column>
      <Column field="zone" header="Zone de livraison" sortable></Column>
      <Column field="delai" header="Délai de livraison" sortable></Column>
      <Column field="colis" header="Type de colis" sortable></Column>
      <Column field="status" header="Statut" sortable></Column>
      <Column field="freeshipping" header="Livraison gratuite" sortable></Column>
    </DataTable>
  </div>

  <div class="my_grid">
    <div class="c-item-1">
      <button class="CTA" @click="visible = true">Créer un nouveau tarif</button>
    </div>
  </div>
</template>

<style scoped>
.CTA {
  background-color: transparent;
  background-repeat: no-repeat;
  width: 200px;
  height: 30px;
  margin: 10px 20px 0 0;
  padding: 2px 10px 0;
  border-radius: 24px;
  border: none;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  text-align: center;
  color: white;
  background-color: #5a42b9;
}
.my_grid {
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: 50px;
}

[class^="c-item"] {
  display: inline-grid;
}

.c-item-1 {
  grid-column: 1;
  justify-content: right;
  margin-top: -20px;
}
</style>
