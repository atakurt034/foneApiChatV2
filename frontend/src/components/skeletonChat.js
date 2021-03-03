import { Skeleton } from '@material-ui/lab'

export const SkeletonChat = () => {
  return (
    <>
      <Skeleton
        variant='rect'
        style={{
          borderRadius: 20,
          padding: '19px 0',
          margin: '20px 0',
          width: '60%',
        }}
      />
      <Skeleton
        variant='rect'
        style={{
          borderRadius: 20,
          padding: '19px 0',
          margin: '20px 0',
          width: '60%',
          marginLeft: 'auto',
        }}
      />
      <Skeleton
        variant='rect'
        style={{
          borderRadius: 20,
          padding: '19px 0',
          margin: '20px 0',
          width: '60%',
        }}
      />
      <Skeleton
        variant='rect'
        style={{
          borderRadius: 20,
          padding: '19px 0',
          margin: '20px 0',
          width: '60%',
          marginLeft: 'auto',
        }}
      />
    </>
  )
}
