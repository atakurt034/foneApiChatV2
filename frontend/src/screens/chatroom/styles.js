import { makeStyles } from '@material-ui/core'

export const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    margin: 10,
  },
  input: {
    width: '100%',
    margin: 10,
  },
  iconButton: {
    padding: 10,
  },
  card: {
    backgroundColor: '#eee',
  },
  sender: {
    backgroundColor: 'Highlight',
    textAlign: 'right',
    float: 'right',
    clear: 'both',
    height: 40,
    borderRadius: 15,
    padding: '5px 0',
    margin: '10px 0',
    width: '80%',
  },
  lastSender: {
    backgroundColor: 'Highlight',
    textAlign: 'right',
    float: 'right',
    clear: 'both',
    height: 40,
    padding: '5px 0',
    margin: '10px 0',
    width: '80%',
    borderRadius: 15,
    borderBottomRightRadius: 0,
    minWidth: 50,
  },
  reciever: {
    textAlign: 'left',
    float: 'left',
    padding: '5px 0',
    margin: '10px 0',
    width: '80%',
    borderRadius: 15,
  },
  lastReciever: {
    textAlign: 'left',
    float: 'left',
    padding: '5px 0',
    margin: '10px 0',
    width: '80%',
    borderRadius: 15,
    borderBottomLeftRadius: 0,
    minWidth: 50,
  },
  text: { margin: '0 10px' },
  textSender: { margin: '10px' },
}))
