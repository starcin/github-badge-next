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
          stargazers {
            totalCount
          }
          languages(first: 100) {
            nodes {
              name
            }
          }
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

function forkCount (repoNodes) {
  let counter = 0
  repoNodes.forEach(node => {
    counter = node.isFork ? counter + 1 : counter
  })
  return counter
}

function countLanguages (repoNodes) {
  const languageCount = new Map()
  repoNodes.forEach(node => {
    node.languages.nodes.forEach(langNode => {
      if (languageCount.has(langNode.name)) {
        languageCount.set(langNode.name, languageCount.get(langNode.name) + 1)
      } else {
        languageCount.set(langNode.name, 1)
      }
    })
  })
  return languageCount
}

function stargazersCount (repoNodes) {
  let counter = 0
  repoNodes.forEach(node => {
    if (!node.isFork) counter += node.stargazers.totalCount
  })
  return counter
}

function sortMapByValueDescending (mapToBeSorted) {
  const mapSort = new Map([...mapToBeSorted.entries()].sort((a, b) => b[1] - a[1]))
  return mapSort
}

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
  badgeData.user = user
  badgeData.userName = fetchedData.user.name
  badgeData.numOfForks = forkCount(badgeData.repos)
  badgeData.numOfRepos = fetchedData.user.repositories.totalCount - badgeData.numOfForks
  badgeData.url = fetchedData.user.url
  badgeData.avatarUrl = fetchedData.user.avatarUrl
  badgeData.numOfFollowers = fetchedData.user.followers.totalCount
  badgeData.numOfStargazers = stargazersCount(badgeData.repos)
  const langKeysArray = Array.from(sortMapByValueDescending(countLanguages(badgeData.repos)).keys())
  badgeData.languages = langKeysArray//.slice(0, 3)
  res.status(201).json(badgeData) //muhtemelen 201 olmayacak
}
