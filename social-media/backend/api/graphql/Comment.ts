import { connectionFromArray, fromGlobalId } from 'graphql-relay';
import { schema } from 'nexus';

schema.objectType({
  name: 'Comment',
  definition: t => {
    t.implements('Node')
    t.model.content()
    t.model.createdAt()
    t.model.postId()
    t.model.author()
    t.model.userId()
  }
})

schema.extendType({
  type: 'Post',
  definition: t => {
    t.connection('comments',{
      type: 'Comment',
      resolve: async (post, args, ctx) => {
        const commentsByPost = await ctx.db.post.findOne({
          where: {
            id: post.id
          }
        }).comments()
        const connection = connectionFromArray(commentsByPost, args)
        return connection
      }
    })
  }
})

//CREATE COMMENT
schema.inputObjectType({
  name: 'CreateCommentInput',
  definition: t => {
    t.string('content', { required:true })
    t.id('postId', { required:true })
  }
})
schema.objectType({
  name: 'CreateCommentPayload',
  definition: t => {
    t.field('comment', { type: 'Comment' })
  }
})

schema.extendType({
  type: 'Mutation',
  definition: t => {
    t.field('createComment', {
      type: 'CreateCommentPayload',
      args: {
        input: schema.arg({
          type: 'CreateCommentInput',
          required: true
        })
      },
      resolve: async(root, { input }, ctx) => {
        const userId = ctx.getUserId()
        const { id: postId } = fromGlobalId(input.postId)
        const post = await ctx.db.post.findOne({
          where: {
            id: postId
          }
        })
        if(!post) throw new Error('no post found!')
        const comment = await ctx.db.comment.create({
          data: {
            content: input.content,
            author: {
              connect: {
                id: userId
              }
            },
            post: {
              connect: {
                id: postId
              }
            }
          }
        })
        console.log(comment)
        return {
          comment
        }
      }
    })
  }
})

//UPDATE COMMENT
schema.inputObjectType({
  name: 'UpdateCommentInput',
  definition: t => {
    t.string('content', { required: true })
    t.id('commentId', { required: true })
  }
})
schema.objectType({
  name: 'UpdateCommentPayload',
  definition: t => {
    t.field('comment', { type: 'Comment' })
  }
})

schema.extendType({
  type: 'Mutation',
  definition: t => {
    t.field('updateComment', {
      type: 'UpdateCommentPayload',
      args: {
        input: schema.arg({
          type: 'UpdateCommentInput',
          required: true
        })
      },
      resolve: async (root, { input }, ctx) => {
        const { id: commentId } = fromGlobalId(input.commentId)
        const comment = await ctx.db.comment.findOne({
          where: {
            id: commentId
          }
        })
        if(!comment) throw new Error('no comment record found!')
        const currentDate = JSON.stringify(new Date()).slice(1,-1)
        const newComment = await ctx.db.comment.update({
          where: {
            id: commentId,
          },
          data: {
            content: input.content,
            createdAt: currentDate
          }
        })
        return {
          comment: newComment
        }
      }
    })
  }
})

//DELETE COMMENT
schema.inputObjectType({
  name: 'DeleteCommentInput',
  definition: t => {
    t.id('commentId', { required: true })
  }
})
schema.objectType({
  name: 'DeleteCommentPayload',
  definition: t => {
    t.field('comment', { type: 'Comment' })
  }
})

schema.extendType({
  type: 'Mutation',
  definition: t => {
    t.field('deleteComment', {
      type: 'DeleteCommentPayload',
      args: {
        input: schema.arg({
          type: 'DeleteCommentInput',
          required: true
        })
      },
      resolve: async (root, { input }, ctx) => {
        const { id: commentId } = fromGlobalId(input.commentId)
        const comment = await ctx.db.comment.findOne({
          where: {
            id: commentId
          }
        })
        if(!comment) throw new Error('no comment record found!')
        const deleteComment = await ctx.db.comment.delete({
          where: { id: commentId },
        })
        return {
          comment: deleteComment
        }
      }
    })
  }
})