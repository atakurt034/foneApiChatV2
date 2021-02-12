import { makeStyles } from '@material-ui/core'

import blue from '@material-ui/core/colors/blue'

export const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.action.active,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  icon: {
    boxSizing: 'border-box',
    display: 'inline-flex',
    alignItems: 'center',
  },
  button: {
    textTransform: 'none',
    margin: '5px 0',
  },
  facebook: {
    backgroundColor: blue[700],
    color: '#fff',
    '&:hover': {
      backgroundColor: blue[900],
    },
  },
  svg: {
    color: '#fff',
    // backgroundColor: '#fff',
  },
}))
