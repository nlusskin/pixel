import { Table, Form, Input, Button, Row, Col } from 'antd'
import { SortOrder } from 'antd/lib/table/interface'
import _copy from 'copy-html-to-clipboard'
import dayjs from 'dayjs'
import UTC from 'dayjs/plugin/utc'
import React from 'react'
import Map from '../components/Map'

import { useAPI } from '../hooks/useAPI'

dayjs.extend(UTC)

const dateFormatString = 'ddd, MMM D YYYY ~ HH:mm:ss'
function formatDate(e:PixelRecord['events']): string {
  if (e.length === 0) return ''
  return dayjs(e?.[(e.length || 1) - 1]?.timestamp).local().format(dateFormatString)
}

const cols = [
  {
    title: 'To',
    dataIndex: 'recipient',
    key: 'recipient'
  },
  {
    title: 'Subject',
    dataIndex: 'subject',
    key: 'subject'
  },
  {
    title: 'Sent',
    dataIndex: 'sentAt',
    key: 'sentAt',
    render: (t:Date) => dayjs(t).local().format(dateFormatString),
    defaultSortOrder: 'descend' as SortOrder,
    sorter: (a:PixelRecord, b:PixelRecord) => dayjs(a.sentAt).valueOf() - dayjs(b.sentAt).valueOf()
  },
  {
    title: 'Last Read',
    dataIndex: 'events',
    key: 'events',
    render: (e:PixelRecord['events']) => formatDate(e)
  },
  {
    title: 'Read Count',
    dataIndex: 'events',
    key: 'events',
    render: (e:PixelRecord['events']) => e.length == 0 ? '' : e.length
  },
  {
    title: 'Location',
    dataIndex: 'events',
    key: 'events',
    render: (e:PixelRecord['events']) => {
      let coords = e?.[(e.length || 1) - 1]?.location
      return <Map coords={coords} display='address' />
    }
  }
]

const innerCols = [
  {
    title: 'Timestamp',
    dataIndex: 'timestamp',
    key: 'timestamp',
    render: (t:Date) => dayjs(t).format(dateFormatString),
    defaultSortOrder: 'descend' as SortOrder,
    sorter: (a:PixelRecord['events'][0], b:PixelRecord['events'][0]) =>
            dayjs(a.timestamp).valueOf() - dayjs(b.timestamp).valueOf()
  },
  {
    title: 'Location',
    dataIndex: 'location',
    key: 'location',
    render: l => <Map coords={l} />
  },
]

// generate img html tag
function img(id:string) {
  return `<img src='https://pixel.vercel.app/api/t/${id}' alt='' width='1' height='1' />`
}

// copy html to clipboard
function Copy(t:string) {
  _copy(t, { asHtml: true})
}

export default function View() {

  let {data, call: refresh} = useAPI<PixelRecord[]>('list')
  let {data: created, call: create} = useAPI('create')

  // create the new tracker
  const onSubmit = (v:any) => {
    create(v)
  }
  // update the list after new tracker is created
  React.useEffect(() => {
    refresh()
    if (created?.[0]?.id)
      Copy(img(created[0].id))
  }, [created])

  // auto refresh the list
  React.useEffect(() => { setInterval(refresh, 300000) }, [])

  const expandedRowRender = (v) => { 
    return (
      <div>
        <p className='text-blue-500 cursor-pointer' onClick={() => Copy(img(v.id))}>Copy HTML</p>
        <Table columns={innerCols} dataSource={v.events} pagination={false} />
      </div>
    )
  }

  return (
    <div className='w-full h-full'>
      <Form onFinish={onSubmit}>
        <Row>
          <Col span={8} className='mr-2'>
            <Form.Item
              label='To'
              name='recipient'
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label='Subject'
              name='subject'
            >
              <Input />
            </Form.Item>
          </Col>
            <Button type='primary' htmlType='submit' className='inline ml-2'>
              Generate Tracker
            </Button>
        </Row>
      </Form>
      <Button onClick={() => refresh()}>Refresh</Button>
      <Table
        columns={cols}
        dataSource={data?.map(d => { return {...d, key: d.id} })}
        expandable={{ expandedRowRender }}
      />
      
    </div>
  )
}


type PixelRecord = {
  id: string
  subject: string
  recipient: string
  sentAt: Date
  events: {
    timestamp: Date
    location: [number|null, number|null] | null
  }[]
}