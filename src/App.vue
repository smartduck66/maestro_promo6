<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Panel from "primevue/panel";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import Checkbox from "primevue/checkbox";
import Slider from "primevue/slider";
import { ref, onMounted } from "vue";
import { ProductService } from "./service/ProductService.js";
import Masthead from "./components/Masthead.vue";

const visible = ref(false); // Gestion de la visibilité de la zone de création d'un nouveau tarif

onMounted(() => {
  ProductService.getProductsMini().then((data: any) => (products.value = data));
});

const products = ref();
const nom_tarif = ref();
const statut = ref(true);
const free_shipping = ref(false);

const zone_livraison = ref();
const zones = ref([{ name: "France" }, { name: "EU" }, { name: "Monde" }]);

const delai_livraison = ref();
const delais = ref([{ name: "1 jour" }, { name: "2 jours" }, { name: "3 jours" }, { name: "4 jours" }, { name: "5 jours" }]);

const mode_livraison = ref();
const modes = ref([{ name: "A domicile" }, { name: "Point relai" }]);

const poids_max = ref();
const volume_max = ref();

const gamme_produits = ref("");
const produits = ref([{ name: "Petits objets" }, { name: "Objets de taille moyenne" }, { name: "Objets volumineux" }]);

const prix = ref();

const transporteur = ref("");
const liste_transporteurs = ref([{ name: "La Poste" }, { name: "Colissimo" }, { name: "Chronopost" }, { name: "DHL" }, { name: "UPS" }, { name: "FEDEX" }]);

function poids_taille_displayed() {
  switch (Object(gamme_produits.value).name) {
    case "Petits objets":
      poids_max.value = 1;
      volume_max.value = 10;
      break;
    case "Objets de taille moyenne":
      poids_max.value = 50;
      volume_max.value = 50;
      break;
    case "Objets volumineux":
      poids_max.value = 100;
      volume_max.value = 100;
      break;
    default:
      break;
  }
}

function prix_displayed() {
  switch (Object(transporteur.value).name) {
    case "La Poste":
      prix.value = 5;
      break;
    case "Colissimo":
      prix.value = 35;
      break;
    case "Chronopost":
      prix.value = 50;
      break;
    case "DHL":
      prix.value = 80;
      break;
    case "UPS":
      prix.value = 90;
      break;
    case "FEDEX":
      prix.value = 100;
      break;
    default:
      break;
  }
}
</script>

<template>
  <Masthead />

  <div class="card">
    <DataTable :value="products" tableStyle="min-width: 50rem">
      <Column field="nom" header="Nom du tarif" sortable></Column>
      <Column field="tarif" header="Prix" sortable></Column>
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

  <div v-if="visible" class="panel">
    <Panel header="Création d'un nouveau tarif de livraison">
      <div class="my_grid_panel">
        <div class="c-item_panel-1">
          <div>Nom du tarif :</div>
        </div>
        <div class="c-item_panel-2">
          <InputText v-model="nom_tarif" class="p-inputtext-sm" type="text" placeholder="ex : Standard France" />
        </div>
        <div class="c-item_panel-3">
          <div>Tarif actif : <Checkbox v-model="statut" :binary="true" /></div>
        </div>
        <div class="c-item_panel-4">
          <div>Gratuité du tarif : <Checkbox v-model="free_shipping" :binary="true" /></div>
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
        <div class="c-item_panel-1">
          <div>Poids maximum (kg) :</div>
        </div>
        <div class="c-item_panel-2">
          <InputText v-model.number="poids_max" />
          <Slider v-model="poids_max" />
        </div>
        <div class="c-item_panel-3">
          <div>
            Mes produits :
            <Dropdown v-model="gamme_produits" class="p-inputtext-sm" :options="produits" optionLabel="name" placeholder="Sélectionner une gamme" />
          </div>
        </div>
        <div class="c-item_panel-4">
          <button class="CTA1" @click="poids_taille_displayed()">Mise à jour poids/volume</button>
        </div>
        <div class="c-item_panel-1">
          <div>Volume maximum (cm3) :</div>
        </div>
        <div class="c-item_panel-2">
          <InputText v-model.number="volume_max" />
          <Slider v-model="volume_max" />
        </div>
        <div class="c-item_panel-1">
          <div>Prix (€) :</div>
        </div>
        <div class="c-item_panel-2">
          <InputText v-model.number="prix" />
          <Slider v-model="prix" />
        </div>
        <div class="c-item_panel-3">
          <div>
            Transporteur :
            <Dropdown
              v-model="transporteur"
              class="p-inputtext-sm"
              :options="liste_transporteurs"
              optionLabel="name"
              placeholder="Sélectionner un transporteur"
            />
          </div>
        </div>
        <div class="c-item_panel-4">
          <button class="CTA1" @click="prix_displayed()">Mise à jour du prix</button>
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

.CTA1 {
  background-color: transparent;
  background-repeat: no-repeat;
  width: 220px;
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
  background-color: #9c27b0;
  margin-top: 5px;
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
  grid-template-columns: 200px 400px 370px 200px;
  grid-template-rows: 40px;
  margin-bottom: 10px;
  row-gap: 20px;
}

[class^="c-item_panel"] {
  display: inline-grid;
}

.c-item_panel-1 {
  grid-column: 1;
  justify-content: left;
  margin-top: 10px;
}
.c-item_panel-2 {
  grid-column: 2;
  justify-content: left;
}

.c-item_panel-3 {
  grid-column: 3;
  justify-content: left;
}

.c-item_panel-4 {
  grid-column: 4;
  justify-content: left;
}
.panel {
  margin-bottom: 20px;
}
</style>
