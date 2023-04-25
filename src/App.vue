<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Panel from "primevue/panel";
import Dropdown from "primevue/dropdown";
import RadioButton from "primevue/radiobutton";
import InputText from "primevue/inputtext";
import Checkbox from "primevue/checkbox";
import Slider from "primevue/slider";
import { ref, onMounted } from "vue";
//import { ProductService } from "./mixins/ProductService.js";
import { database } from "./mixins/utils.js";
import Masthead from "./components/Masthead.vue";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
const toast = useToast();

const visible_creation = ref(false); // Gestion de la visibilité de la zone de création d'un nouveau tarif

onMounted(async () => load_tarifs());

const products = ref();
const nom_tarif = ref("");
const statut = ref(true);
const zone_livraison = ref("");
const delai_livraison = ref("");
const mode_livraison = ref("");
const poids_max = ref();
const volume_max = ref();
const gamme_produits = ref("");
const produits = ref([{ name: "Petits objets" }, { name: "Objets de taille moyenne" }, { name: "Objets volumineux" }]);
const prix = ref();
const update = ref(null); // flag qui permet de savoir si l'on crée un tarif 'from scratch' ou si l'on modifie un tarif existant

// Le prix indiqué correspond au tarif de base d'une livraison : FR, délai '2j', Mode 'à domicile', Poids/dimension '<1kg <10cm3'
const prix_base_transporteurs = [
  { name: "La Poste", price: 6 },
  { name: "Colissimo", price: 8 },
  { name: "Chronopost", price: 10 },
  { name: "DHL", price: 18 },
  { name: "UPS", price: 20 },
  { name: "FEDEX", price: 21 },
];

const transporteurs = ref([
  { name: "La Poste", price: 0, diff: 0 },
  { name: "Colissimo", price: 0, diff: 0 },
  { name: "Chronopost", price: 0, diff: 0 },
  { name: "DHL", price: 0, diff: 0 },
  { name: "UPS", price: 0, diff: 0 },
  { name: "FEDEX", price: 0, diff: 0 },
]);

const visible_tarifs_transporteurs = ref(false);

const selectedProduct = ref();
const onRowSelect = async (event: any) => {
  // Sélectionner une ligne du tableau permet de modifier le tarif en base
  selectedProduct.value = null;
  const result = await database(event.data.nom, "view", null);

  // On remplit les valeurs de l'écran "tarif" et on l'affiche
  nom_tarif.value = result[0].nom;
  statut.value = result[0].actif;
  zone_livraison.value = result[0].zone;
  delai_livraison.value = result[0].delai + (result[0].delai > 1 ? " jours" : " jour");
  mode_livraison.value = result[0].mode;
  poids_max.value = result[0].poids_max;
  volume_max.value = result[0].volume_max;
  prix.value = result[0].tarif;
  visible_creation.value = true;
  update.value = result[0].ref.id; // On stocke la référence du record Fauna pour l'updater
};

async function load_tarifs() {
  //ProductService.getProducts().then((data: any) => (products.value = data));
  // Connexion à la base distante
  const result = await database(null, "view", null);

  class product {
    nom: string;
    tarif: string;
    zone: string;
    delai: string;
    mode: string;
    colis: string;
    status: string;

    constructor() {
      this.nom = "";
      this.tarif = "";
      this.zone = "";
      this.delai = "";
      this.mode = "";
      this.colis = "";
      this.status = "";
    }
  }

  // Mapping des records de la database avec l'objet 'products'
  products.value = result.map((item: any) => {
    const p = new product(); // note the "new" keyword here
    p.nom = item.nom;
    p.tarif = item.tarif + " €";
    p.zone = item.zone;
    p.delai = item.delai + (item.delai > 1 ? " jours" : " jour");
    p.mode = item.mode;
    p.colis = "<" + item.poids_max + "kg <" + item.volume_max + "cm3";
    p.status = item.actif ? "actif" : "inactif";

    return p;
  });
}

function poids_taille_displayed() {
  // Affichage des dimensions dans les champs à cet effet ******************************************************************************************************
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
  // L'affichage des prix de chaque transporteur est fonction de son prix de base affecté de divers coefficients relatifs aux caractéristiques du transport souhaité
  // (zone, délai, mode de livraison) et du poids/dimension du colis
  // ***************************************************************************************************************************************************************

  interface coeff {
    name: string;
    FR: number;
    EU: number;
    Monde: number;
    j1: number;
    j2: number;
    j3: number;
    j4: number;
    j5: number;
    Domicile: number;
    Relai: number;
    Petit: number;
    Moyen: number;
    Gros: number;
  }

  const coefficients: coeff[] = [
    { name: "La Poste", FR: 1, EU: 1.3, Monde: 4, j1: 1.2, j2: 1, j3: 0.9, j4: 0.8, j5: 0.7, Domicile: 1, Relai: 0.9, Petit: 1, Moyen: 1.5, Gros: 3 },
    { name: "Colissimo", FR: 1, EU: 1.2, Monde: 3, j1: 1.2, j2: 1, j3: 0.8, j4: 0.7, j5: 0.6, Domicile: 1, Relai: 0.9, Petit: 1, Moyen: 1.5, Gros: 2 },
    { name: "Chronopost", FR: 1, EU: 1.1, Monde: 2, j1: 1.2, j2: 1, j3: 0.7, j4: 0.7, j5: 0.6, Domicile: 1, Relai: 0.9, Petit: 1, Moyen: 1.2, Gros: 1.8 },
    { name: "DHL", FR: 1, EU: 1.05, Monde: 1.5, j1: 1.2, j2: 1, j3: 0.7, j4: 0.6, j5: 0.6, Domicile: 1, Relai: 0.9, Petit: 1, Moyen: 1.1, Gros: 1.3 },
    { name: "UPS", FR: 1, EU: 1.2, Monde: 1.1, j1: 1.1, j2: 1, j3: 0.7, j4: 0.5, j5: 0.5, Domicile: 1, Relai: 0.9, Petit: 1, Moyen: 1.1, Gros: 1.2 },
    { name: "FEDEX", FR: 1, EU: 1.2, Monde: 1.2, j1: 1.05, j2: 1, j3: 0.6, j4: 0.5, j5: 0.5, Domicile: 1, Relai: 0.9, Petit: 1, Moyen: 1.1, Gros: 1.2 },
  ];

  if (zone_livraison.value && delai_livraison.value && mode_livraison.value && poids_max.value && volume_max.value) {
    //GUARD
    const prix_saisi = prix.value ? prix.value : 0;

    // Evolution du prix de référence pour chaque transporteur
    transporteurs.value.map((item: any) => {
      // En fonction de la zone de livraison
      let coeff_zone: number = 0;
      switch (Object(zone_livraison.value).name) {
        case "France":
          coeff_zone =
            coefficients[
              coefficients.findIndex(function (x) {
                return x.name == item.name;
              })
            ]["FR"];
          break;
        case "EU":
          coeff_zone =
            coefficients[
              coefficients.findIndex(function (x) {
                return x.name == item.name;
              })
            ]["EU"];
          break;
        case "Monde":
          coeff_zone =
            coefficients[
              coefficients.findIndex(function (x) {
                return x.name == item.name;
              })
            ]["Monde"];
          break;
        default:
          break;
      }

      // En fonction du délai de livraison
      let coeff_delai: number = 0;
      switch (Object(delai_livraison.value).name) {
        case "1 jour":
          coeff_delai =
            coefficients[
              coefficients.findIndex(function (x) {
                return x.name == item.name;
              })
            ]["j1"];
          break;
        case "2 jours":
          coeff_delai =
            coefficients[
              coefficients.findIndex(function (x) {
                return x.name == item.name;
              })
            ]["j2"];
          break;
        case "3 jours":
          coeff_delai =
            coefficients[
              coefficients.findIndex(function (x) {
                return x.name == item.name;
              })
            ]["j3"];
          break;
        case "4 jours":
          coeff_delai =
            coefficients[
              coefficients.findIndex(function (x) {
                return x.name == item.name;
              })
            ]["j4"];
          break;
        case "5 jours":
          coeff_delai =
            coefficients[
              coefficients.findIndex(function (x) {
                return x.name == item.name;
              })
            ]["j5"];
          break;
        default:
          break;
      }

      // En fonction du mode de livraison
      let coeff_mode: number = 0;
      switch (Object(mode_livraison.value).name) {
        case "A domicile":
          coeff_mode =
            coefficients[
              coefficients.findIndex(function (x) {
                return x.name == item.name;
              })
            ]["Domicile"];
          break;
        case "Point relai":
          coeff_mode =
            coefficients[
              coefficients.findIndex(function (x) {
                return x.name == item.name;
              })
            ]["Relai"];
          break;
        default:
          break;
      }

      // En fonction du type de colis
      let coeff_colis: number = 0;
      let gamme_colis: string = "";

      if (gamme_produits.value) {
        gamme_colis = Object(gamme_produits.value).name; // La gamme de produits a déjà été sélectionnée
      } else {
        // Il faut déterminer dans quelle catégorie on classe le colis, en fonction de ses caractéristiques (on ne s'occupe que du poids pour simplifier)
        if (poids_max.value <= 1) {
          gamme_colis = "Petits objets";
        } else if (poids_max.value > 1 && poids_max.value <= 50) {
          gamme_colis = "Objets de taille moyenne";
        } else {
          gamme_colis = "Objets volumineux";
        }
      }

      switch (gamme_colis) {
        case "Petits objets":
          coeff_colis =
            coefficients[
              coefficients.findIndex(function (x) {
                return x.name == item.name;
              })
            ]["Petit"];
          break;
        case "Objets de taille moyenne":
          coeff_colis =
            coefficients[
              coefficients.findIndex(function (x) {
                return x.name == item.name;
              })
            ]["Moyen"];
          break;
        case "Objets volumineux":
          coeff_colis =
            coefficients[
              coefficients.findIndex(function (x) {
                return x.name == item.name;
              })
            ]["Gros"];
          break;
        default:
          break;
      }

      // Le prix de base est donc recalculé en fonction des différents coefficients
      item.price = (
        prix_base_transporteurs[
          prix_base_transporteurs.findIndex(function (x) {
            return x.name == item.name;
          })
        ]["price"] *
        coeff_zone *
        coeff_delai *
        coeff_mode *
        coeff_colis
      ).toFixed(2);

      // Calcul de la différence entre le tarif de chaque transporteur et le prix TTC saisi par le marchand
      item.diff = (prix_saisi - item.price).toFixed(2);
    });

    // On rend le tableau visible, les calculs ayant été réalisés
    visible_tarifs_transporteurs.value = true;
  } else {
    // Si les caractéristiques de la livraison ne sont pas toutes remplies
    toast.add({ severity: "warn", summary: "Tous les champs doivent être renseignés", detail: "Affichage des tarifs impossible", life: 2000 });
  }
}

async function save_tarif() {
  // Sauvegarde du nouveau tarif *********************************************************************************************************************
  if (nom_tarif.value && zone_livraison.value && delai_livraison.value && mode_livraison.value && poids_max.value && volume_max.value) {
    // Sauvegarde des données en base
    class tarif_livraison {
      nom: string;
      tarif: number;
      zone: string;
      delai: number;
      mode: string;
      poids_max: number;
      volume_max: number;
      actif: boolean;

      constructor() {
        this.nom = "";
        this.tarif = 0;
        this.zone = "";
        this.delai = 0;
        this.mode = "";
        this.poids_max = 0;
        this.volume_max = 0;
        this.actif = true;
      }
    }
    const tarif_to_save = new tarif_livraison(); // note the "new" keyword here
    tarif_to_save.nom = nom_tarif.value;
    tarif_to_save.tarif = prix.value;
    tarif_to_save.zone = zone_livraison.value;
    tarif_to_save.delai = Number(delai_livraison.value.substring(0, 1));
    tarif_to_save.mode = mode_livraison.value;
    tarif_to_save.poids_max = poids_max.value;
    tarif_to_save.volume_max = volume_max.value;
    tarif_to_save.actif = statut.value;

    // Pas de gestion d'erreurs dans ce prototype
    if (update.value) {
      await database(tarif_to_save, "update", update.value);
    } else {
      await database(tarif_to_save, "insert", null);
    }

    // Message de succès et RAZ du formulaire pour une prochaine saisie
    toast.add({ severity: "success", summary: "Transaction réalisée !", detail: "Tarif de livraison disponible", life: 2000 });
    nom_tarif.value = "";
    statut.value = true;
    zone_livraison.value = "";
    delai_livraison.value = "";
    mode_livraison.value = "";
    poids_max.value = null;
    volume_max.value = null;
    gamme_produits.value = "";
    prix.value = null;
    visible_tarifs_transporteurs.value = false;
    visible_creation.value = false;

    // Reload les tarifs pour raffraichir la liste
    await load_tarifs();
    update.value = null;
  } else {
    // Tous les champs doivent être remplis avant une sauvegarde
    toast.add({ severity: "warn", summary: "Tous les champs doivent être renseignés", detail: "Sauvegarde du nouveau tarif impossible", life: 2000 });
  }
}
</script>

<template>
  <Masthead />
  <Toast position="top-center" />

  <div class="card">
    <DataTable
      v-model:selection="selectedProduct"
      :value="products"
      selectionMode="single"
      dataKey="id"
      :metaKeySelection="false"
      @rowSelect="onRowSelect"
      scrollable
      scrollHeight="400px"
      tableStyle="min-width: 50rem"
    >
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
      <button class="CTA" @click="visible_creation = true">Créer un nouveau tarif</button>
    </div>
  </div>

  <div v-if="visible_creation" class="panel">
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
          <div>
            <RadioButton v-model="zone_livraison" inputId="Z1" name="livraison" value="France" />
            <label for="Z1" class="ml-2"> France </label>
            <RadioButton v-model="zone_livraison" inputId="Z2" name="Livraison" value="EU" />
            <label for="Z2" class="ml-2"> EU </label>
            <RadioButton v-model="zone_livraison" inputId="Z3" name="Livraison" value="Monde" />
            <label for="Z3" class="ml-2"> Monde </label>
          </div>
        </div>
        <div class="c-item_panel-1">
          <div>Délai de livraison :</div>
        </div>
        <div class="c-item_panel-2">
          <div>
            <RadioButton v-model="delai_livraison" inputId="D1" name="delai" value="1 jour" />
            <label for="D1" class="ml-2"> 1 j </label>
            <RadioButton v-model="delai_livraison" inputId="D2" name="delai" value="2 jours" />
            <label for="D2" class="ml-2"> 2 j </label>
            <RadioButton v-model="delai_livraison" inputId="D3" name="delai" value="3 jours" />
            <label for="D3" class="ml-2"> 3 j </label>
            <RadioButton v-model="delai_livraison" inputId="D4" name="delai" value="4 jours" />
            <label for="D4" class="ml-2"> 4 j </label>
            <RadioButton v-model="delai_livraison" inputId="D5" name="delai" value="5 jours" />
            <label for="D5" class="ml-2"> 5 j </label>
          </div>
        </div>
        <div class="c-item_panel-1">
          <div>Mode de livraison :</div>
        </div>
        <div class="c-item_panel-2">
          <div>
            <RadioButton v-model="mode_livraison" inputId="L1" name="livraison" value="A domicile" />
            <label for="L1" class="ml-2"> A domicile </label>
            <RadioButton v-model="mode_livraison" inputId="L2" name="Livraison" value="Point relai" />
            <label for="L2" class="ml-2"> Point relai</label>
          </div>
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

      <div class="FlexWrapper"><button class="CTA2" @click="save_tarif()">Sauvegarder le tarif</button></div>
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
  margin-top: 10px;
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
