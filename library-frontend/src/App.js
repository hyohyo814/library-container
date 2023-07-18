import { useState, useEffect } from 'react'
import { useQuery, useSubscription, useApolloClient } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Notification from './components/Notificaion'
import Menu from './components/Menu'
import Recommend from './components/Recommend'
import { BOOK_ADDED, ALL_BOOKS, USER } from './queries'

export const updateCache = (cache, query, addedBook) => {
  const uniqByTitle = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    console.log(allBooks)
    return {
      allBooks: uniqByTitle(allBooks.concat(addedBook))
    }
  })
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [error, setError] = useState(null)
  const user = useQuery(USER)
  const client = useApolloClient()

  useEffect(() => {
    const exists = localStorage.getItem('loggedInUser')
    if (exists) {
      setToken(exists)
      if (user.data) {
        console.log(user.data.me.favoriteGenre)
        localStorage.setItem('favoriteGenre', user.data.me.favoriteGenre)
      }    
    }
  }, [user.data])


  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      window.alert(`${addedBook.title} added`)

      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    }
  })
  
  const relayMsg = (details) => {
    setError(details)
    setTimeout(() => {
      setError(null)
    }, 5000)
  }

  return (
    <div>
      <Menu setPage={setPage} setToken={setToken} token={token} />
      <LoginForm setToken={setToken} show={page === 'login'} setPage={setPage} />
      <Notification errMsg={error} />
      <Authors show={page === 'authors'} token={token} setError={relayMsg} />
      <Books show={page === 'books'} setError={relayMsg} />
      <NewBook show={page === 'add'} setError={relayMsg} />
      <Recommend show={page === 'user'} setError={relayMsg} />
    </div>
  )
}

export default App