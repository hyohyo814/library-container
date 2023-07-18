import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { ADD_BOOK, ALL_BOOKS } from '../queries'
import { updateCache } from '../App'

const NewBook = ({show, setError}) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [publishedInp, setPublishedInp] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])
  const [addBook] = useMutation(ADD_BOOK, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    },
    update: (cache, res) => {
      updateCache(cache, { query: ALL_BOOKS }, res.data.addBook)
    }
  })
  
  if (!show) {
    return null
  }

  const submit = async (event) => {
    event.preventDefault()
    console.log('add book...')
    const published = Number(publishedInp)
    addBook({ variables: {
      title, author, published, genres
    }})
    
    setTitle('')
    setPublishedInp('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <h2>new book</h2>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type='numeric'
            value={publishedInp}
            onChange={({ target }) => setPublishedInp(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook