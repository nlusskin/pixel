import { Table, Form, Input, Button, Row, Col } from 'antd'
import dayjs from 'dayjs'
import React from 'react'

import { useAPI } from '../hooks/useAPI'

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
    key: 'sentAt'
  },
  {
    title: 'Last Read',
    dataIndex: 'events',
    key: 'events',
    render: (e:PixelRecord['events']) => e?.[(e.length || 1) - 1]?.timestamp
  },
  {
    title: 'Read Count',
    dataIndex: 'events',
    key: 'events',
    render: (e:PixelRecord['events']) => e.length
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
    key: 'timestamp'
  },
  {
    title: 'Location',
    dataIndex: 'location',
    key: 'location'
  },
]

export default function View() {

  let {data, call: refresh} = useAPI<PixelRecord[]>('list')
  let {data: created, call: create} = useAPI('create')

  const onSubmit = (v:any) => {
    create(v)
  }
  React.useEffect(refresh, [created])


  const expandedRowRender = (v) => { 
    return <Table columns={innerCols} dataSource={v.events} pagination={false} />
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