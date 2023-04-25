<script setup lang="ts">
import { ref } from "vue";

const open = ref(false); //gestion de la fenêtre modale d'aide
</script>

<template>
  <div class="FlexWrapper">
    <img src="/Prestashop-logo_reduced.png" alt="Prestashop" />
    <div>
      
      <div class="my_grid">
        <div class="c-item-1">
          <span class="titre">Carriers</span>
          <span class="sous-titre">Liste des tarifs de livraison</span>
        </div>
        <div class="c-item-2">
          <button class="CTA" @click="open = true">A propos</button>
        </div>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <div v-if="open" class="modal">
      <div @click="open = false">
        <img src="/close.webp" class="Close" />
      </div>
      <div class="FlexWrapper_modal">
        <h2>Maestro - Promo #6</h2>
        Ce prototype constitue la proposition du Groupe 5 pour le projet de fin de formation. Notre parti-pris, tiré des opportunités de la journey map :
        <br /><br />
        . Un back-office épuré, plus simple, sur un seul écran<br />
        . Un utilisateur mieux guidé<br />
        . La suppression de champs inutiles<br />
        <br />
        La base de données est limitée à 10 enregistrements.
        <br /><br />
        Anass, André, Maimouna, Mathilde
        <br /><br />
        28 avril 2023
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
a {
  outline: none;
  color: white;
  text-decoration: none;
  padding: 2px 1px 0;
}
.FlexWrapper {
  width: 1280px;
  height: auto;
  flex-grow: 0;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  align-items: start;
  gap: 30px;
  margin-bottom: 40px;
  margin-top: 10px;
  margin-left:35px;
}


.titre {
  font-size: 24px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: #42b983;
}
.sous-titre {
  font-size: 18px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: grey;
  margin-top:10px;
}

.my_grid {
  display: grid;
  grid-template-columns: 800px 300px;
  grid-template-rows: 50px;

}

[class^="c-item"] {
  display: inline-grid;
}

.c-item-1 {
  grid-column: 1;
  justify-content: left;
  margin-top: 32px;
}
.c-item-2 {
  grid-column: 2;
  justify-content: right;
  margin-top: 32px;
}

.modal {
  position: fixed;
  z-index: 999;
  top: 10%;
  left: 43.5%;
  margin-left: -150px;
  width: 350px;
  height: 450px;
  flex-grow: 0;
  border-radius: 10px;
  background-color: #42b983;
}

img.Close {
  width: 32px;
  height: 32px;
  flex-grow: 0;
  margin: 16px 0px 2px 310px;
  object-fit: contain;
}

.FlexWrapper_modal {
  width: 300px;
  height: 400px;
  flex-grow: 0;
  display: flex;
  gap: 20px;
  margin: -20px 0px 0px 20px;
  flex-direction: column;
  justify-content: flex-start;
  color: white;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: left;
}

.CTA {
  background-color: transparent;
  background-repeat: no-repeat;
  width: 120px;
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
  background-color: #42b983;
  margin-top: 20px;
}
</style>
