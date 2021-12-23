// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { gql, ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const GET_DATA_BY_LOGIN = gql`
  query ($login: String!, $after: String){
    user(login: $login){
      name
      id
      url
      avatarUrl
      followers {
        totalCount
      }
      repositories(first: 5, after: $after) {
        totalCount
        nodes {
          name
          updatedAt
          isFork
          url
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`

const httpLink = createHttpLink({
  uri: 'https://api.github.com/graphql'
})

const authLink = setContext((_, { headers }) => {
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`
    }
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})



export default async function handler(req, res) {
  const data = req.body
  const {user} = data
  const badgeData = {}
  console.log(user)
  let fetchedData
  async function iterateFetch (cursor) {
    fetchedData = (
      await client.query({
        query: GET_DATA_BY_LOGIN,
        variables: { login: user, after: cursor },
        notifyOnNetworkStatusChange: true
      })
    ).data
    badgeData.repos = [...(badgeData.repos || []), ...fetchedData.user.repositories.nodes]

    if (fetchedData.user.repositories.pageInfo.hasNextPage) {
      await iterateFetch(fetchedData.user.repositories.pageInfo.endCursor)
    }
  }
  
  

  await iterateFetch()
  res.status(201).json({ userName: fetchedData.user.name, repos: badgeData.repos })
  // console.log({fetchedData})
}




// export default function handler(req, res) {
//   res.status(200).json({ name: 'John Doe' })
// }
