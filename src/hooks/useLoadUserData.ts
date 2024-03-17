import { useEffect, useState } from 'react'
import { useRequest } from 'ahooks'
import { useDispatch } from 'react-redux'
import useGetUserInfo from './useGetUserInfo'
import { getUserInfoService } from '../services/user'
import { loginReducer } from '../store/userReducer'

function useLoadUserData() {
  const dispatch = useDispatch()
  const [waitingUserData, setWaitingUserData] = useState(true)

  // ajax 加载用户信息
  const { run } = useRequest(getUserInfoService, {
    manual: true,
    onSuccess(result) {
      const { username, nickName, email, headPic, phoneNumber } = result.data
      dispatch(loginReducer({ username, nickName, email, headPic, phoneNumber })) // 存储到 redux store
    },
    onFinally() {
      setWaitingUserData(false)
    },
  })

  // 判断当前 redux store 是否已经存在用户信息
  const { username } = useGetUserInfo() // redux store
  useEffect(() => {
    if (username) {
      setWaitingUserData(false) // 如果 redux store 已经存在用户信息，就不用重新加载了
      return
    }
    run() // 如果 redux store 中没有用户信息，则进行加载
  }, [username])

  return { waitingUserData }
}

export default useLoadUserData
