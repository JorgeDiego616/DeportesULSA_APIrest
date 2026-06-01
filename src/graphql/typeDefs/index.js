const { gql } = require('apollo-server');

const typeDefs = gql`

    type Poeta_14446 {
        poet_code: ID!
        first_name: String
        sur_name: String
        address: String
        post_code: String
        telephone_number: String
    }

    type Poema_14446 {
        poem_code: ID!
        poem_title: String
        poem_contents: String
        poet_code: ID
    }

    type Cliente_14446 {
        customer_code: ID!
        first_name: String
        sur_name: String
        address: String
        post_code: String
        telephone_number: String
    }

    type Venta_14446 {
        sale_code: ID!
        date: String
        amount: Float
        customer_code: ID
    }

    type Publicacion_14446 {
        publication_code: ID!
        title: String
        price: Float
    }

    type PoetaPoema_14446 {
        poet_code: ID
        first_name: String
        sur_name: String
        poem_code: ID
        poem_title: String
        poem_contents: String
    }

    type ClienteVenta_14446 {
        customer_code: ID
        first_name: String
        sur_name: String
        sale_code: ID
        date: String
        amount: Float
    }

    type PoemaPublicacion_14446 {
        poem_code: ID
        poem_title: String
        poem_contents: String
        publication_code: ID
        title: String
        price: Float
    }

    type Query {
        poetas: [Poeta_14446]
        poeta(poet_code: Int!): Poeta_14446
        poemas: [Poema_14446]
        clientes: [Cliente_14446]
        getPoetaPoema: [PoetaPoema_14446]
        getClienteVenta: [ClienteVenta_14446]
        getPoemaPublicacion: [PoemaPublicacion_14446]
    }

    type Mutation {
        # Altas
        addPoeta(poet_code: Int!, first_name: String, sur_name: String, address: String, post_code: String, telephone_number: String): Poeta_14446!
        addPoema(poem_code: Int!, poem_title: String, poem_contents: String, poet_code: Int): Poema_14446!
        addCliente(customer_code: Int!, first_name: String, sur_name: String, address: String, post_code: String, telephone_number: String): Cliente_14446!
        addVenta(sale_code: Int!, date: String, amount: Float, customer_code: Int): Venta_14446!

        # Modificaciones
        updateCliente(customer_code: Int!, first_name: String, sur_name: String, address: String, post_code: String, telephone_number: String): Cliente_14446!
        updatePublicacion(publication_code: Int!, title: String, price: Float): Publicacion_14446!
        updateVenta(sale_code: Int!, date: String, amount: Float, customer_code: Int): Venta_14446!

        # Bajas
        deletePoemaPublicacion(poem_code: Int!, publication_code: Int!): ID!
        deleteVentaPublicacion(sale_code: Int!, publication_code: Int!): ID!
    }
`;

module.exports = typeDefs;