import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://rickandmortyapi.com/graphql',
  cache: new InMemoryCache(),
});

export default async (req, res) => {
  const search = req.body;
  try {
    const { data } = await client.query({
      query: gql`
        # Write your query or mutation here
        query {
          characters(filter: { name: "${search}" }) {
            info {
              count
              pages
            }
            results {
              name
              id
              location {
                id
                name
              }
              origin {
                id
                name
              }
              episode {
                episode
                air_date
                id
              }
              image
            }
          }
        }
      `,
    });
    res.status(200).json({ characters: data.characters.results, error: null });
  } catch (error) {
    if (error.message == '404: Not Found') {
      res.status(400).json({ character: null, error: 'No Character Found' });
    } else {
      res
        .status(500)
        .json({ characters: null, error: 'Internal Error, please try again' });
    }
  }
};
