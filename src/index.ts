import { config } from 'dotenv';
import { ApolloServer } from 'apollo-server';
import createServer from './createServer';

config();

const server: ApolloServer = createServer();

server.listen().then(({ url }) => {
  console.info('Server started at:', url);
});
