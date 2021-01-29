import db from './backend'

export default async (req, res) => {
  let {data, error} = await db.from('pixels').select(`
    *,
    events(*)

  `)
  res.json(data)
}
