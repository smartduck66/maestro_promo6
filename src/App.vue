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
  ProductService.getProducts().then((data: any) => (products.value = data));
});

const products = ref();
const nom_tarif = ref();
const statut = ref(true);

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

const transporteurs = ref([
  { name: "La Poste", price: 3, diff: 0 },
  { name: "Colissimo", price: 5, diff: 0 },
  { name: "Chronopost", price: 10, diff: 0 },
  { name: "DHL", price: 15, diff: 0 },
  { name: "UPS", price: 20, diff: 0 },
  { name: "FEDEX", price: 25, diff: 0 },
]);

const visible_tarifs_transporteurs = ref(false);

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
  //GUARD
  const prix_saisi = prix.value ? prix.value : 0;

  transporteurs.value.map((item: any) => {
    item.diff = prix_saisi-item.price ;
  });
  visible_tarifs_transporteurs.value = true;
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
          <div>Prix client (€ TTC) :</div>
        </div>
        <div class="c-item_panel-2">
          <InputText v-model.number="prix" />
          <Slider v-model="prix" />
        </div>
        <div class="c-item_panel-3">
          <button class="CTA1" @click="prix_displayed()">Vérification des prix</button>
        </div>
        <div class="c-item_panel-1">
          <div v-if="visible_tarifs_transporteurs">
            <div :style="{ 'font-weight': 600 }">Tarifs du marché en fonction des critères saisis</div>
            <br />
            <DataTable :value="transporteurs" showGridlines tableStyle="width: 25rem">
              <Column field="name" header="Société"></Column>
              <Column field="price" header="Prix (€)"></Column>
              <Column field="diff" header="Marge (€)"></Column>
            </DataTable>
          </div>
        </div>
      </div>

      <div class="FlexWrapper"><button class="CTA2" @click="visible = false">Sauvegarder le nouveau tarif</button></div>
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

.CTA2 {
  background-color: transparent;
  background-repeat: no-repeat;
  width: 280px;
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
  margin-top: 40px;
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
  grid-template-columns: 200px 320px 370px 200px;
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

.FlexWrapper {
  width: 1280px;
  height: auto;
  flex-grow: 0;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 10px;
  padding-right: 20px;
}
</style>
