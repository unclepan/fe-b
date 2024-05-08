import React, { FC, FormEvent, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { message } from 'antd'
import { useRequest } from 'ahooks'
import { REGISTER_PATHNAME, MANAGE_INDEX_PATHNAME, RESET_PASSWORD_PATHNAME } from '../router'
import { loginService } from '../services/user'
import { USER_TOKEN, REFRESH_USER_TOKEN, USER_INFO, setToken } from '../utils/local-storage'
import { loginReducer } from '../store/userReducer'

const USERNAME_KEY = 'USERNAME'
const PASSWORD_KEY = 'PASSWORD'

function rememberUser(username: string, password: string) {
  localStorage.setItem(USERNAME_KEY, username)
  localStorage.setItem(PASSWORD_KEY, password)
}

function deleteUserFromStorage() {
  localStorage.removeItem(USERNAME_KEY)
  localStorage.removeItem(PASSWORD_KEY)
}

function getUserInfoFromStorage() {
  return {
    username: localStorage.getItem(USERNAME_KEY) || '',
    password: localStorage.getItem(PASSWORD_KEY) || '',
  }
}

const Login: FC = () => {
  const dispatch = useDispatch()
  const [initData, setInitData] = useState({
    username: '',
    password: '',
    remember: false,
  })
  const [messageApi, contextHolder] = message.useMessage()
  const nav = useNavigate()

  useEffect(() => {
    const { username, password } = getUserInfoFromStorage()
    setInitData({
      username,
      password,
      remember: !!username && !!password,
    })
  }, [])

  const { run } = useRequest(
    async (username: string, password: string) => {
      const data = await loginService(username, password)
      return data
    },
    {
      manual: true,
      onSuccess(result) {
        const { accessToken = '', refreshToken = '', userInfo = {} } = result.data
        setToken(USER_TOKEN, accessToken)
        setToken(REFRESH_USER_TOKEN, refreshToken)
        setToken(USER_INFO, JSON.stringify(userInfo))
        const { username, nickName, email, headPic, phoneNumber } = userInfo

        dispatch(loginReducer({ username, nickName, email, headPic, phoneNumber }))
        messageApi.success('登录成功')
        nav(MANAGE_INDEX_PATHNAME)
      },
      onError() {
        messageApi.error('登陆失败，请检查用户名密码')
      },
    }
  )

  const onFinish = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const { username, password, remember } = initData
    run(username, password) // 执行 ajax
    if (remember) {
      rememberUser(username, password)
    } else {
      deleteUserFromStorage()
    }
  }

  return (
    <>
      {contextHolder}
      <section className="bg-gradient-to-b from-gray-100 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="pt-32 pb-12 md:pt-40 md:pb-20">
            {/* Page header */}
            <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
              <h1 className="h1">欢迎回来，我们的存在是为了让工作变得更容易</h1>
            </div>

            {/* Form */}
            <div className="max-w-sm mx-auto">
              <form onSubmit={onFinish}>
                <div className="flex flex-wrap -mx-3 mb-4">
                  <div className="w-full px-3">
                    <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor="email">
                      电子邮箱 <span className="text-red-600">*</span>
                    </label>
                    <input
                      value={initData.username}
                      onChange={e =>
                        setInitData({
                          ...initData,
                          username: e.target.value,
                        })
                      }
                      name="username"
                      id="name"
                      type="name"
                      className="form-input w-full text-gray-800"
                      placeholder="请输入电子邮箱"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-4">
                  <div className="w-full px-3">
                    <div className="flex justify-between">
                      <label
                        className="block text-gray-800 text-sm font-medium mb-1"
                        htmlFor="password"
                      >
                        密码 <span className="text-red-600">*</span>
                      </label>
                      <Link
                        to={RESET_PASSWORD_PATHNAME}
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        忘记密码？
                      </Link>
                    </div>
                    <input
                      value={initData.password}
                      onChange={e =>
                        setInitData({
                          ...initData,
                          password: e.target.value,
                        })
                      }
                      name="password"
                      id="password"
                      type="password"
                      className="form-input w-full text-gray-800"
                      placeholder="请输入密码"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-4">
                  <div className="w-full px-3">
                    <div className="flex justify-between">
                      <label className="flex items-center">
                        <input
                          checked={initData.remember}
                          onChange={() => {
                            setInitData({
                              ...initData,
                              remember: !initData.remember,
                            })
                          }}
                          name="remember"
                          type="checkbox"
                          className="form-checkbox"
                        />
                        <span className="text-gray-600 ml-2">保持登录状态</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mt-6">
                  <div className="w-full px-3">
                    <button
                      type="submit"
                      className="btn text-white bg-blue-600 hover:bg-blue-700 w-full"
                    >
                      登陆
                    </button>
                  </div>
                </div>
              </form>
              <div className="flex items-center my-6">
                <div className="border-t border-gray-300 grow mr-3" aria-hidden="true"></div>
                <div className="text-gray-600 italic">Or</div>
                <div className="border-t border-gray-300 grow ml-3" aria-hidden="true"></div>
              </div>
              <form>
                {/* <div className="flex flex-wrap -mx-3 mb-3">
                  <div className="w-full px-3">
                    <button className="btn px-0 text-white bg-gray-900 hover:bg-gray-800 w-full relative flex items-center">
                      <svg
                        className="w-4 h-4 fill-current text-white opacity-75 shrink-0 mx-4"
                        viewBox="0 0 16 16"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M7.95 0C3.578 0 0 3.578 0 7.95c0 3.479 2.286 6.46 5.466 7.553.397.1.497-.199.497-.397v-1.392c-2.187.497-2.683-.993-2.683-.993-.398-.895-.895-1.193-.895-1.193-.696-.497.1-.497.1-.497.795.1 1.192.795 1.192.795.696 1.292 1.888.895 2.286.696.1-.497.298-.895.497-1.093-1.79-.2-3.578-.895-3.578-3.975 0-.895.298-1.59.795-2.087-.1-.2-.397-.994.1-2.087 0 0 .695-.2 2.186.795a6.408 6.408 0 011.987-.299c.696 0 1.392.1 1.988.299 1.49-.994 2.186-.795 2.186-.795.398 1.093.199 1.888.1 2.087.496.596.795 1.291.795 2.087 0 3.08-1.889 3.677-3.677 3.875.298.398.596.895.596 1.59v2.187c0 .198.1.497.596.397C13.714 14.41 16 11.43 16 7.95 15.9 3.578 12.323 0 7.95 0z" />
                      </svg>
                      <span className="flex-auto pl-16 pr-8 -ml-16">Continue with GitHub</span>
                    </button>
                  </div>
                </div> */}
                <div className="flex flex-wrap -mx-3">
                  <div className="w-full px-3">
                    <button className="btn px-0 text-white bg-red-600 hover:bg-red-700 w-full relative flex items-center">
                      <svg
                        className="w-4 h-4 fill-current text-white opacity-75 shrink-0 mx-4"
                        viewBox="0 0 16 16"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M7.9 7v2.4H12c-.2 1-1.2 3-4 3-2.4 0-4.3-2-4.3-4.4 0-2.4 2-4.4 4.3-4.4 1.4 0 2.3.6 2.8 1.1l1.9-1.8C11.5 1.7 9.9 1 8 1 4.1 1 1 4.1 1 8s3.1 7 7 7c4 0 6.7-2.8 6.7-6.8 0-.5 0-.8-.1-1.2H7.9z" />
                      </svg>
                      <span className="flex-auto pl-16 pr-8 -ml-16">使用手机号登录</span>
                    </button>
                  </div>
                </div>
              </form>
              <div className="text-gray-600 text-center mt-6">
                您还没有账户吗？
                <Link
                  to={REGISTER_PATHNAME}
                  className="text-blue-600 hover:underline transition duration-150 ease-in-out"
                >
                  注册新用户
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Login
