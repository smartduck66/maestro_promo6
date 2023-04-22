export const ProductService = {
    getProductsData() {
        return [
            {
                nom: 'Standard France',
                tarif: '5 €',
                zone: 'FR',
                delai: '2 jours',
                mode: 'A domicile',
                colis: '<1kg <10cm3',
                status: 'actif'
            },
            {
                nom: 'Express France',
                tarif: '15 €',
                zone: 'FR',
                delai: '1 jour',
                mode: 'A domicile',
                colis: '<1kg <10cm3',
                status: 'actif'
            },
            {
                nom: 'Colis volumineux France',
                tarif: '50 €',
                zone: 'FR',
                delai: '3 jours',
                mode: 'A domicile',
                colis: '>50kg >50cm3',
                status: 'actif'
            },
            {
                nom: 'Livraison gratuite France',
                tarif: '0 €',
                zone: 'FR',
                delai: '1 jour',
                mode: 'Point relai',
                colis: '<50kg <50cm3',
                status: 'actif'
            },
            {
                nom: 'Standard Europe',
                tarif: '25 €',
                zone: 'EU',
                delai: '2 jours',
                mode: 'A domicile',
                colis: '<50kg <50cm3',
                status: 'actif'
            },
            {
                nom: 'Colis moyen Europe',
                tarif: '35 €',
                zone: 'EU',
                delai: '2 jours',
                mode: 'A domicile',
                colis: '<50kg <50cm3',
                status: 'actif'
            },
            {
                nom: 'Standard International',
                tarif: '60 €',
                zone: 'Monde',
                delai: '5 jours',
                mode: 'A domicile',
                colis: '<50kg <50cm3',
                status: 'actif'
            },
            {
                nom: 'Express International',
                tarif: '100 €',
                zone: 'Monde',
                delai: '2 jours',
                mode: 'A domicile',
                colis: '<50kg <50cm3',
                status: 'actif'
            },
            {
                nom: 'Black Friday France',
                tarif: '0 €',
                zone: 'FR',
                delai: '1 jour',
                mode: 'Point relai',
                colis: '<50kg <50cm3',
                status: 'inactif'
            }
        ];
    },

    getProductsMini() {
        return Promise.resolve(this.getProductsData().slice(0, 5));
    },

    getProductsSmall() {
        return Promise.resolve(this.getProductsData().slice(0, 10));
    },

    getProducts() {
        return Promise.resolve(this.getProductsData());
    },

    getProductsWithOrdersSmall() {
        return Promise.resolve(this.getProductsWithOrdersData().slice(0, 10));
    },

    getProductsWithOrders() {
        return Promise.resolve(this.getProductsWithOrdersData());
    }
};