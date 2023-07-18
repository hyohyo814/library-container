import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../queries'
import EditYear from './EditYear'

const Authors = ({ show, token, setError }) => {
  const result = useQuery(ALL_AUTHORS)

  if (!show) {
    return null
  }
  if (result.loading || !result.data) {
    return <div>loading authors...</div>
  }

  const authors = result.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!token ? null : <EditYear authors={authors} setError={setError} />}
    </div>
  )
}

export default Authors
