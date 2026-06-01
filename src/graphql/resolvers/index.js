const db = require('../../database/db');

const resolvers = {
    Query: {
        // Tablas
        poetas: async () => await db.select().table('Poeta'),
        poemas: async () => await db.select().table('Poema'),
        clientes: async () => await db.select().table('Cliente'),

        poeta: async (_, { poet_code }) => {
        return await db('Poeta').where({ poet_code }).first();
        },

        // Procedimientos almacenados
        getPoetaPoema: async () => {
            const result = await db.raw('CALL getPoeta_poema_14446()');
            return result[0][0];
        },
        getClienteVenta: async () => {
            const result = await db.raw('CALL getCliente_venta_14446()');
            return result[0][0];
        },
        getPoemaPublicacion: async () => {
            const result = await db.raw('CALL getPoema_publicacion_14446()');
            return result[0][0];
        },
    },

    Mutation: {
        // Altas
        addPoeta: async (_, { poet_code, first_name, sur_name, address, post_code, telephone_number }) => {
            await db('Poeta').insert({ poet_code, first_name, sur_name, address, post_code, telephone_number });
            return await db('Poeta').where({ poet_code }).first();
        },
        addPoema: async (_, { poem_code, poem_title, poem_contents, poet_code }) => {
            await db('Poema').insert({ poem_code, poem_title, poem_contents, poet_code });
            return await db('Poema').where({ poem_code }).first();
        },
        addCliente: async (_, { customer_code, first_name, sur_name, address, post_code, telephone_number }) => {
            await db('Cliente').insert({ customer_code, first_name, sur_name, address, post_code, telephone_number });
            return await db('Cliente').where({ customer_code }).first();
        },
        addVenta: async (_, { sale_code, date, amount, customer_code }) => {
            await db('Venta').insert({ sale_code, date, amount, customer_code });
            return await db('Venta').where({ sale_code }).first();
        },

        // Modificaciones
        updateCliente: async (_, { customer_code, first_name, sur_name, address, post_code, telephone_number }) => {
            await db('Cliente').where({ customer_code }).update({ first_name, sur_name, address, post_code, telephone_number });
            return await db('Cliente').where({ customer_code }).first();
        },
        updatePublicacion: async (_, { publication_code, title, price }) => {
            await db('Publicacion').where({ publication_code }).update({ title, price });
            return await db('Publicacion').where({ publication_code }).first();
        },
        updateVenta: async (_, { sale_code, date, amount, customer_code }) => {
            await db('Venta').where({ sale_code }).update({ date, amount, customer_code });
            return await db('Venta').where({ sale_code }).first();
        },

        // Bajas
        deletePoemaPublicacion: async (_, { poem_code, publication_code }) => {
            await db('Poema_publicación').where({ poem_code, publication_code }).del();
            return poem_code;
        },
        deleteVentaPublicacion: async (_, { sale_code, publication_code }) => {
            await db('Venta_publicacion').where({ sale_code, publication_code }).del();
            return sale_code;
        },
    },
};

module.exports = resolvers;