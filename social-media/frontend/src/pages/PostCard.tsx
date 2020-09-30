import React from 'react'
import { Card, CardHeader, CardContent, makeStyles } from '@material-ui/core'
import { useParams } from 'react-router-dom'
import { useLazyLoadQuery } from 'react-relay/hooks'
import { graphql } from 'babel-plugin-relay/macro'
import { PostCardQuery } from './__generated__/PostCardQuery.graphql'

const PostCard = () => {
  const postId = useParams().postId
  const classes = useStyles()
  const data = useLazyLoadQuery<PostCardQuery>(
    graphql`
      query PostCardQuery($id: ID!) {
        node(
          id: $id
        ) {
          ... on Post {
            id
            content
            author {
              name
              email
              id
            }
            createdAt
          }
        }
      }
    `,
    {id: postId}
  )
  console.log(data)
  return( 
    <div>
      <Card className={classes.card}>
        <CardHeader title={data?.node?.author?.name}/>
        <CardContent>
          <div>
            <p>{data?.node?.content}</p>
            <p>{data?.node?.createdAt}</p>
          </div>
        </CardContent>
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