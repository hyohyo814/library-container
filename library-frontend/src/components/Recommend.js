import { useQuery } from '@apollo/client'
import { useState, useEffect } from 'react'
import { ALL_BOOKS } from '../queries'

const Recommend = ({ show, setError }) => {
  const [genre, setGenre] = useState(null)
  const allBooks = useQuery(ALL_BOOKS, {
    variables: { genre },
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    }
  })
  useEffect(() => {
    const favGen = localStorage.getItem('favoriteGenre')
    console.log(favGen)
    setGenre(favGen)
  }, [])
  

  if (!show) {
    return null
  }

  const books = allBooks.data.allBooks

  return (
    <div>
      <h2>Recommendations</h2>
      <p>books in your favorite genre </p>
      {
        !genre
        ?
        <div>loading book data...</div>
        :
        <table style={{ width: '100%', textAlign: 'left', marginBottom: '20px' }}>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>}
    </div>
  )
}

export default Recommend
