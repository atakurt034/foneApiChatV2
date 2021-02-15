import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useStyles } from './acStyle'
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Grid,
  Container,
  useTheme,
  useMediaQuery,
} from '@material-ui/core'
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople'
import AssignmentIcon from '@material-ui/icons/Assignment'
import StoreIcon from '@material-ui/icons/Store'

let anchorOriginSettings = {
  vertical: 'top',
  horizontal: 'left',
}

let transformOriginSettings = {
  vertical: 'top',
  horizontal: 'right',
}

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={anchorOriginSettings}
    transformOrigin={transformOriginSettings}
    {...props}
  />
))

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem)

export const Admin = () => {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const classes = useStyles()
  const theme = useTheme()
  const sm = useMediaQuery(theme.breakpoints.down('xs'))

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  let arrowIcon = <ArrowLeftIcon fontSize='small' />
  if (sm) {
    arrowIcon = <ArrowRightIcon fontSize='small' />
  }

  const logged = (
    <>
      <Button
        disabled={!userInfo.isAdmin}
        fullWidth
        style={{
          textTransform: 'capitalize',
          fontSize: 'inherit',
          margin: '0 0 0 5px',
          // padding: '5px',
          boxSizing: 'border-box',
          color: '#000',
          fontWeight: 400,
        }}
        variant='text'
        disableElevation
        disableFocusRipple
        onClick={handleClick}
        size='small'
      >
        <Container disableGutters>
          <Grid justify='flex-start' container>
            <Grid item xs={4}>
              <SupervisorAccountIcon
                style={{ marginRight: 10 }}
                fontSize='small'
                color='action'
              />
            </Grid>
            <Grid
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
              item
              xs={8}
            >
              {arrowIcon} {'Admin'}
            </Grid>
          </Grid>
        </Container>
      </Button>

      <StyledMenu
        id='customized-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <StyledMenuItem onClick={handleClose}>
          <Link className={classes.link} to='/admin/userlist'>
            <ListItemIcon>
              <EmojiPeopleIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText primary='Users' />
          </Link>
        </StyledMenuItem>
        <StyledMenuItem onClick={handleClose}>
          <Link className={classes.link} to='/admin/productlist'>
            <ListItemIcon>
              <StoreIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText primary='Products' />
          </Link>
        </StyledMenuItem>
        <StyledMenuItem onClick={handleClose}>
          <Link className={classes.link} to='/admin/orderlist'>
            <ListItemIcon>
              <AssignmentIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText primary='Orders' />
          </Link>
        </StyledMenuItem>
      </StyledMenu>
    </>
  )

  if (sm) {
    anchorOriginSettings = {
      vertical: 'bottom',
      horizontal: 'right',
    }
    transformOriginSettings = {
      vertical: 'bottom',
      horizontal: 'left',
    }
  }

  // useEffect(() => {
  // }, [])

  return logged
}
