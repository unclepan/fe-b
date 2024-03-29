import { useKeyPress } from 'ahooks'
import { useDispatch } from 'react-redux'
import {
  pushPast,
  removeSelectedComponent,
  copySelectedComponent,
  pasteCopiedComponent,
  selectPrevComponent,
  selectNextComponent,
  undoComponents,
  redoComponents,
} from '../store/componentsReducer'
import useGetComponentInfo from './useGetComponentInfo'

/**
 * 判断 activeElem 是否合法
 */
function isActiveElementValid() {
  const activeElem = document.activeElement

  // // 没有增加 dnd-kit 之前
  // if (activeElem === document.body) return true // 光标没有 focus 到 input

  // 增加了 dnd-kit 以后
  if (activeElem === document.body) return true
  if (activeElem?.matches('div[role="button"]')) return true

  return false
}

function useBindCanvasKeyPress() {
  const dispatch = useDispatch()

  const { currentPage } = useGetComponentInfo()

  // 删除组件
  useKeyPress(['backspace', 'delete'], () => {
    if (!isActiveElementValid()) return
    dispatch(pushPast())
    dispatch(removeSelectedComponent())
  })

  // 复制
  useKeyPress(['ctrl.c', 'meta.c'], () => {
    if (!isActiveElementValid()) return
    dispatch(pushPast())
    dispatch(copySelectedComponent())
  })

  // 粘贴
  useKeyPress(['ctrl.v', 'meta.v'], () => {
    if (!isActiveElementValid()) return
    dispatch(pushPast())
    dispatch(pasteCopiedComponent({ page: currentPage }))
  })

  // 选中上一个
  useKeyPress('uparrow', () => {
    if (!isActiveElementValid()) return
    dispatch(selectPrevComponent())
  })

  // 选中下一个
  useKeyPress('downarrow', () => {
    if (!isActiveElementValid()) return
    dispatch(selectNextComponent())
  })

  // 撤销
  useKeyPress(
    ['ctrl.z', 'meta.z'],
    () => {
      if (!isActiveElementValid()) return
      dispatch(undoComponents())
    },
    {
      exactMatch: true, // 严格匹配
    }
  )

  // 重做
  useKeyPress(['ctrl.shift.z', 'meta.shift.z'], () => {
    if (!isActiveElementValid()) return
    dispatch(redoComponents())
  })
}

export default useBindCanvasKeyPress
