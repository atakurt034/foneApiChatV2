import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import { UserMenu } from './user/userMenu'

const useStyles = makeStyles({
  list: {
    width: 250,
    padding: `0 10px`,
    overflow: 'auto',
  },
  fullList: {
    width: 'auto',
  },
})

export const UserDrawer = ({
  open,
  close,
  history,
  userList,
  chatroomId,
  socket,
}) => {
  const classes = useStyles()

  const list = userList.map((user, index) => (
    <div
      key={index}
      className={clsx(classes.list, classes.fullList)}
      role='presentation'
    >
      <UserMenu
        closed={close}
        history={history}
        user={user}
        chatroomId={chatroomId}
        socket={socket}
      />
    </div>
  ))

  return (
    <div>
      <>
        <Drawer anchor={'left'} open={open} onClose={close}>
          {list}
        </Drawer>
      </>
    </div>
  )
}
