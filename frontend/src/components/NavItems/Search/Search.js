import React, { useState } from 'react'
import InputBase from '@material-ui/core/InputBase'
import SearchIcon from '@material-ui/icons/Search'
import { useStyles } from './sStyle'

export const Search = ({ history }) => {
  const classes = useStyles()
  const [keyword, setKeyword] = useState('')

  const submitHandler = (e) => {
    if (keyword.trim()) {
      e.preventDefault()
      history.push(`/search/${keyword}`)
    } else {
      history.push('/')
    }
  }
  let search = (
    <div className={classes.search}>
      <form onSubmit={submitHandler}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>

        <InputBase
          onChange={(e) => setKeyword(e.target.value)}
          placeholder='Search…'
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search' }}
        />
      </form>
    </div>
  )

  return search
}
