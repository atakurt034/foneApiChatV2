import { withStyles, Menu, MenuItem, makeStyles } from '@material-ui/core'

export const useStyles = makeStyles((theme) => ({
  active: {
    textTransform: 'none',
    textDecoration: 'underline',
    justifyContent: 'left',
  },
  inactive: {
    textTransform: 'none',
    justifyContent: 'left',
  },
}))

export const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'left',
    }}
    {...props}
  />
))

export const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem)
