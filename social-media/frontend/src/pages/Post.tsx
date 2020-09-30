import React from 'react'
import { Card, CardHeader, CardContent, makeStyles } from '@material-ui/core'
import { useFragment } from 'react-relay/hooks'
import { graphql } from 'babel-plugin-relay/macro'
import { Post_data$key } from './__generated__/Post_data.graphql'
import { useHistory } from 'react-router-dom'

type PostProps = {
  data: Post_data$key | null
}

const Post:React.FC<PostProps> = props => {
  const classes = useStyles()
  const { push } = useHistory()
  const data = useFragment<Post_data$key>(
    graphql`
      fragment Post_data on Post {
        id
        content
        author {
          name
          email
          id
        }
        createdAt
      }
    `
    ,props.data
  )
  return (
    <Card
      className={classes.card} 
      onClick={ () => push(`/post/${data?.id}`) }>
      <CardHeader title={data?.author?.name}/>
      <CardContent>{data?.content}</CardContent>
    </Card>
  )
}
export default Post

const useStyles = makeStyles(() => ({
  card: {
    maxWidth: 345,
    margin: '5px',
    '&:hover': {
      backgroundColor: 'lightgrey'
    }
  },
}))