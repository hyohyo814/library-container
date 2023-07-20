import { useApolloClient } from '@apollo/client'

const Menu = ({setPage, setToken, token}) => {
  const client = useApolloClient()
  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('authors')
  }
  const loggedOut = () => {
    return (
      <>
        <button onClick={() => setPage('login')}>login</button>
      </>
    )
  }

  const loggedIn = () => {
    return (
      <>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('user')}>recommend</button>
        <button onClick={logout}>logout</button>
      </>
    )
  }

  return (
    <div>
      <button onClick={() => setPage('authors')}>authors</button>
      <button onClick={() => setPage('books')}>books</button>
      {token !== null ? loggedIn() : loggedOut()}
    </div>
  )
}

export default Menu