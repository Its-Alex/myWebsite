import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloClient, ApolloLink, InMemoryCache, HttpLink } from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'
import ReactGA from 'react-ga'
import * as Sentry from '@sentry/browser'
import posthog from 'posthog-js'

import * as serviceWorker from './ServiceWorker'
import GlobalTheme from './components/Theme'
import Home from './pages/Home'
import './i18n/I18n'

if (
  process.env.REACT_APP_CURRICULUM_POSTHOG_TOKEN &&
  process.env.REACT_APP_CURRICULUM_POSTHOG_URL
) {
  console.info('Posthog enable')
  posthog.init(process.env.REACT_APP_CURRICULUM_POSTHOG_TOKEN, { api_host: process.env.REACT_APP_CURRICULUM_POSTHOG_URL })
}
if (process.env.REACT_APP_CURRICULUM_SENTRY_DSN) {
  console.info('Sentry enable')
  Sentry.init({ dsn: process.env.REACT_APP_CURRICULUM_SENTRY_DSN })
}
ReactGA.initialize('UA-152708823-1')
ReactGA.pageview('/')

const httpLink = new HttpLink({ uri: 'https://api.github.com/graphql' })

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: 'Bearer 923c2ce575fe95918fe182a1ce0e60a8bea7c43f'
    }
  })

  return forward(operation)
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <GlobalTheme>
      <Home />
    </GlobalTheme>
  </ApolloProvider>
  , document.getElementById('root'))

serviceWorker.unregister()
