import { Skeleton } from '@material-ui/lab'

export const SkeletonChat = () => {
  return (
    <>
      <Skeleton
        variant='rect'
        style={{
          padding: '10px 0',
          margin: '10px 0',
          width: '80%',
        }}
      />
      <Skeleton
        variant='rect'
        style={{
          padding: '10px 0',
          margin: '10px 0',
          width: '80%',
          marginLeft: 'auto',
        }}
      />
      <Skeleton
        variant='rect'
        style={{
          padding: '10px 0',
          margin: '10px 0',
          width: '80%',
        }}
      />
    </>
  )
}
