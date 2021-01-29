import { Table, Form, Input, Button, Row, Col } from 'antd'
import dayjs from 'dayjs'
import UTC from 'dayjs/plugin/utc'
import React from 'react'

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
    sorter: (a:PixelRecord, b:PixelRecord) => dayjs(a.sentAt).valueOf() - dayjs(b.sentAt).valueOf(),
    defaultSortOrder: 'descend'
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
    render: (e:PixelRecord['events']) => e?.[(e.length || 1) - 1]?.location
  }
]

const innerCols = [
  {
    title: 'Timestamp',
    dataIndex: 'timestamp',
    key: 'timestamp',
    render: (t:Date) => dayjs(t).format(dateFormatString)
  },
  {
    title: 'Location',
    dataIndex: 'location',
    key: 'location'
  },
]

function img(id:string) {
  return `<img src='https://pixel.vercel.app/api/t/${id}' alt='' width='1' height='1' />`
}

export default function View() {

  let {data, call: refresh} = useAPI<PixelRecord[]>('list')
  let {data: created, call: create} = useAPI('create')

  const onSubmit = (v:any) => {
    create(v)
  }
  React.useEffect(() => {
    refresh()
    console.log('created',created)
    if (created?.[0]?.id)
      navigator.clipboard.writeText(img(created[0].id))
  }, [created])


  const expandedRowRender = (v) => { 
    return (
      <div>
        <a href='#'>{v.id}</a>
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
      <Table
        columns={cols}
        dataSource={data?.map(d => { return {...d, key: d.id} })}
        expandable={{ expandedRowRender }}
      />
      <Button onClick={() => navigator.clipboard.writeText('text text')}>Copy</Button>
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