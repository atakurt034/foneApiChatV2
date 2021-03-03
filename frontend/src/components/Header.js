import React from 'react'

import { makeStyles, AppBar, Toolbar, Grid } from '@material-ui/core'

import Account from './NavItems/Account/Account'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  brand: {
    flex: 1,
    width: 'auto',
  },
}))

export const Header = ({ socket, counter }) => {
  const classes = useStyles()

  return (
    <AppBar position='static'>
      <Toolbar>
        <Grid className={classes.brand}>Chat App</Grid>
        {<Account socket={socket} counter={counter} />}
      </Toolbar>
    </AppBar>
  )
}
