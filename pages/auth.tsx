import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Input, Button, message, Tabs } from 'antd'
import React from 'react'
import { useAPI } from '../hooks/useAPI'


const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
}
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export default function Auth() {

  const [action, setAction] = React.useState('login')

  const { data: created, call: createUser } = useAPI('auth/create')
  const { data: user, call: getUser } = useAPI('auth/get')


  // Edit logic
  
  const onSubmit = (v:any) => {
    if (action == 'signup') createUser(v)
    if (action == 'login') getUser(v)
  }
  const onFail = () => {
    message.error('Login failed')
  }
  React.useEffect(() => {
    if (user?.error || created?.error) return onFail()
    console.info(user, created)
  }, [user, created])
  
  
  return (
    <div className="login-form w-1/4 screen-v-center m-auto">
      <Tabs defaultActiveKey='login' onChange={key => setAction(key)}>
        <Tabs.TabPane tab='Login' key='login'></Tabs.TabPane>
        <Tabs.TabPane tab='Sign Up' key='signup'></Tabs.TabPane>
      </Tabs>
      <Form
        initialValues={{ remember: true }}
        onFinish={onSubmit}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your email', type: 'email' }]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your password' }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        {action == 'signup' &&
          <Form.Item
            name="confirmpassword"
            rules={[{ required: true, message: 'Please confirm your password'}, 
              ({getFieldValue}) => ({
                validator(_, value) {
                  if (getFieldValue('password') === value) return Promise.resolve()
                  return Promise.reject('Passwords don\'t match')
                }
              })
          ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Confirm Password"
            />
          </Form.Item>
        }
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            {action === 'login' ? 'Log in' : 'Sign Up'}
          </Button>
        </Form.Item>
        {action == 'login' &&
          <Form.Item>
            <a className="login-form-forgot text-blue-600" href="">
              Forgot password
            </a>
          </Form.Item>
        }

      </Form>
    </div>
    
  )
}