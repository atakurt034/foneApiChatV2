import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import { Typography } from '@material-ui/core'

const useStyles = makeStyles({
  list: {
    width: 250,
    padding: 20,
    height: '75vh',
    overflow: 'auto',
  },
  fullList: {
    width: 'auto',
  },
})

export const UserDrawer = ({ userList, open, close }) => {
  console.log(userList)
  const classes = useStyles()

  const list = (
    <div className={clsx(classes.list, classes.fullList)} role='presentation'>
      <List>
        <Typography variant='h6'>Online Users</Typography>
        <Divider variant='middle' />
        {userList.map((user, index) => (
          <p key={index}>{user}</p>
        ))}
      </List>
    </div>
  )

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
