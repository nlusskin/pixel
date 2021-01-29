import db from './backend'

export default async (req, res) => {
  let form = JSON.parse(req.body)
  let {data, error} = await db.from('pixels').insert(form)
  res.json(data)
}
