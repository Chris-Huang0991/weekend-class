import React from 'react'
import { useLazyLoadQuery } from 'react-relay/hooks'
import { graphql } from 'babel-plugin-relay/macro'
import { PostsQuery } from './__generated__/PostsQuery.graphql'
import Post from './Post'

type PostsProps = {
  data?: PostsQuery
}

const Posts: React.FC<PostsProps> = () => {
  const data = useLazyLoadQuery<PostsQuery>(
    graphql`
      query PostsQuery {
        posts(
          first: 3
          where: { author_email: "1234" }
        ) {
          edges {
            node {
              ...Post_data
            }
          }
        }
      }
    `,
    {}
  )

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column'}}
    >
      {data?.posts?.edges?.map(e => <Post data={e?.node} />)}
    </div>
  )
}
export default Posts

