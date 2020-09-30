import React from 'react'
import { Card, CardHeader, CardContent, makeStyles } from '@material-ui/core'
import { useParams } from 'react-router-dom'

const PostCard = () => {
  const postId = useParams().postId
  const classes = useStyles()
  return( 
    <div>
      <Card className={classes.card}>
        <CardHeader title={postId}/>
        <CardContent>{postId}</CardContent>
      </Card>
  </div>)
}

export default PostCard

const useStyles = makeStyles(() => ({
  card: {
    maxWidth: 345,
    margin: '5px',
    '&:hover': {
      backgroundColor: 'lightgrey'
    }
  },
}))