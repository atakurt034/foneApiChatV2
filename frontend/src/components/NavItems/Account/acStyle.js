import { makeStyles, withStyles, Badge } from '@material-ui/core'

export const useStyles = makeStyles((theme) => ({
  link: {
    display: 'flex',
    color: 'inherit',
    textDecoration: 'none',
    '&:active': {
      color: 'inherit',
    },
    '&:visited': {
      color: 'inherit',
    },
  },
  avatar: {
    height: 30,
    width: 30,
  },
}))

export const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: 'red',
    color: 'red',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))(Badge)
