import { useMutation } from '@apollo/client'
import { useState } from 'react'
import Select from 'react-select'
import { EDIT_YEAR, ALL_AUTHORS } from '../queries'

const EditYear = ({ authors, setError }) => {
  const [name, setName] = useState(null)
  const [born, setBorn] = useState('')

  const [editAuthor] = useMutation(EDIT_YEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onError: (error) => {
      setError( error.graphQLErrors[0].message)
    },
  })

  const nameSel = authors.map((a) => {
    return {
      value: a.name,
      label: a.name,
    }
  })

  const update = (event) => {
    event.preventDefault()
    const setBornTo = Number(born)
    console.log({ name, setBornTo })
    editAuthor({ variables: { name, setBornTo } })
    setName('')
    setBorn('')
  }

  return (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={update}>
        <div>
          name
          <Select
            defaultValue={name}
            onChange={target => setName(target.value)}
            options={nameSel}
          />
        </div>
        <div>
          born
          <br />
          <input
            type="numeric"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default EditYear
