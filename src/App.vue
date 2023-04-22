<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Panel from "primevue/panel";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import { ref, onMounted } from "vue";
import { ProductService } from "./service/ProductService.js";
import Masthead from "./components/Masthead.vue";

const visible = ref(false); // Gestion de la visibilité de la zone de création d'un nouveau tarif

onMounted(() => {
  ProductService.getProductsMini().then((data: any) => (products.value = data));
});

const products = ref();
const nom_tarif = ref();

const zone_livraison = ref();
const zones = ref([{ name: "France" }, { name: "EU" }, { name: "Monde" }]);

const delai_livraison = ref();
const delais = ref([{ name: "1 jour" }, { name: "2 jours" }, { name: "3 jours" }, { name: "4 jours" }, { name: "5 jours" }]);

const mode_livraison = ref();
const modes = ref([{ name: "A domicile" }, { name: "Point relai" }]);
</script>

<template>
  <Masthead />

  <div class="card">
    <DataTable :value="products" tableStyle="min-width: 50rem">
      <Column field="nom" header="Nom du tarif" sortable></Column>
      <Column field="tarif" header="Type de tarif" sortable></Column>
      <Column field="zone" header="Zone" sortable></Column>
      <Column field="delai" header="Délai" sortable></Column>
      <Column field="mode" header="Mode" sortable></Column>
      <Column field="colis" header="Type de colis" sortable></Column>
      <Column field="status" header="Statut" sortable></Column>
      <Column field="freeshipping" header="Gratuité" sortable></Column>
    </DataTable>
  </div>

  <div class="my_grid">
    <div class="c-item-1">
      <button class="CTA" @click="visible = true">Créer un nouveau tarif</button>
    </div>
  </div>

  <div v-if="visible">
    <Panel header="Création d'un nouveau tarif de livraison">
      <div class="my_grid_panel">
        <div class="c-item_panel-1">
          <div>Nom du tarif :</div>
        </div>
        <div class="c-item_panel-2">
          <InputText v-model="nom_tarif" class="p-inputtext-sm" type="text" placeholder="ex : Standard France" />
        </div>
        <div class="c-item_panel-1">
          <div>Zone de livraison :</div>
        </div>
        <div class="c-item_panel-2">
          <Dropdown v-model="zone_livraison" class="p-inputtext-sm" :options="zones" optionLabel="name" placeholder="Sélectionner une zone" />
        </div>
        <div class="c-item_panel-1">
          <div>Délai de livraison :</div>
        </div>
        <div class="c-item_panel-2">
          <Dropdown v-model="delai_livraison" class="p-inputtext-sm" :options="delais" optionLabel="name" placeholder="Sélectionner un délai de livraison" />
        </div>
        <div class="c-item_panel-1">
          <div>Mode de livraison :</div>
        </div>
        <div class="c-item_panel-2">
          <Dropdown v-model="mode_livraison" class="p-inputtext-sm" :options="modes" optionLabel="name" placeholder="Sélectionner un mode de livraison" />
        </div>
      </div>
    </Panel>
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

.my_grid_panel {
  display: grid;
  grid-template-columns: 180px 200px;
  grid-template-rows: 40px;
  margin-bottom: 50px;
  row-gap: 20px;
}

[class^="c-item_panel"] {
  display: inline-grid;
}

.c-item_panel-1 {
  grid-column: 1;
  justify-content: left;
  margin-top:10px;
}
.c-item_panel-2 {
  grid-column: 2;
  justify-content: left;
}
</style>
