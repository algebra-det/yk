import { Client } from '@elastic/elasticsearch'

const client = new Client({
  node: process.env.ELASTIC_NODE,
  auth: {
    apiKey: process.env.ELASTIC_API_KEY!
  }
})

export default client
