export const ProductService = {
    getProductsData() {
        return [
            {
                nom: 'Standard France',
                tarif: '5 €',
                zone: 'FR',
                delai: '1 jour',
                mode: 'A domicile',
                colis: '<1kg <10cm3',
                status: 'actif',
                freeshipping: 'Non'
            },
            {
                nom: 'Colis volumineux France',
                tarif: '50 €',
                zone: 'FR',
                delai: '3 jours',
                mode: 'A domicile',
                colis: '>50kg >50cm3',
                status: 'actif',
                freeshipping: 'Non'
            },
            {
                nom: 'Standard Europe',
                tarif: '25 €',
                zone: 'EU',
                delai: '2 jours',
                mode: 'A domicile',
                colis: '<50kg <50cm3',
                status: 'actif',
                freeshipping: 'Non'
            },
            {
                nom: 'Black Friday France',
                tarif: '0 €',
                zone: 'FR',
                delai: '1 jour',
                mode: 'Point relai',
                colis: '<50kg <50cm3',
                status: 'inactif',
                freeshipping: 'Oui'
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