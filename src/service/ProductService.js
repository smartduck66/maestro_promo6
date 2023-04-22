export const ProductService = {
    getProductsData() {
        return [
            {
                nom: 'Standard France',
                tarif: 'Unique',
                zone: 'FR',
                delai: '1 jour',
                colis: '<10kg <10cm3',
                status: 'actif',
                freeshipping: 'Non'
            },
            {
                nom: 'Standard Europe',
                tarif: 'Variable',
                zone: 'EU',
                delai: '2 jours',
                colis: '<50kg <100cm3',
                status: 'actif',
                freeshipping: 'Non'
            },
            {
                nom: 'Black Friday France',
                tarif: 'Unique',
                zone: 'FR',
                delai: '1 jour',
                colis: '<20kg <50cm3',
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