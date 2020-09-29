import { Environment, Network, RecordSource, Store } from 'relay-runtime'

const { REACT_APP_API_ENDPOINT } = process.env

const source = new RecordSource()
const store = new Store(source)
const network = Network.create((operation, variables) => {
  if(!REACT_APP_API_ENDPOINT) throw new Error('error')
  return fetch(REACT_APP_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'content-type': 'application'
    },
    body: JSON.stringify({
      query: operation.text,
      variables
    })
  })
  .then(res => res.json())
})

const environment = new Environment({
  network,
  store,
})
export default environment