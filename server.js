require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./src/graphql/typeDefs');
const resolvers = require('./src/graphql/resolvers');
const { verifyToken } = require('./src/utils/auth');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.replace('Bearer ', '');

        if (token) {
            try {
                const user = verifyToken(token);
                return { user };
            } catch (error) {
                console.log('Token inválido:', error.message);
            }
        }
        return {};
    },
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
    console.log(`🚀 Servidor listo en ${url} 🚀`);
});