import { schema, use } from "nexus";
import { connectionFromPromisedArray, fromGlobalId, connectionFromArray } from "graphql-relay";
import { arg } from "nexus/components/schema";
import { decodeBase64 } from "bcryptjs";

schema.objectType({
  name: 'Post',
  definition: t => {
    t.implements('Node')
    // t.model.id()
    t.model.content()
    t.model.likes()
    t.model.author()
    t.model.createdAt()
  }
})

schema.extendType({
  type: 'User',
  definition: t => {
    // t.model.posts()
    // t.list.field('posts', {
    //   type: 'Post',
    //   resolve: async (user, _args, ctx) => {
    //     const postsByUser = await ctx.db.user.findOne({ where: { id: user.id }}).posts()
    //     const connection = connectionFromArray(postsByUser, args)
    //     return postsByUser
    //   }
    // })
    t.connection('posts', {
      type: 'Post',
      resolve: async (user, args, ctx) => {
        const postsByUser = await ctx.db.user.findOne({ where: { id: user.id }}).posts()
        const connection = connectionFromArray(postsByUser, args)

        return connection
      }
    })
    t.connection('likes', {
      type: 'Like',
      resolve: async (user, args ,ctx) => {
        const likeByUser = await ctx.db.user.findOne({ where:{ id: user.id }}).likes()
        const connection = connectionFromArray(likeByUser, args)
        return connection
      }
    })
  }
})

// POSTS QUERY
schema.inputObjectType({
  name: 'PostConnetWhereInput',
  definition: t => {
    t.string('keyword')
    t.string('author_email')
  }
})
schema.extendType({
  type: 'Query',
  definition: t => {
    t.connection('posts', {
      type: 'Post',
      additionalArgs: {
        where: 'PostConnetWhereInput'
      },
      resolve: (_root, { where, ...args }, ctx) => {
        return connectionFromPromisedArray(
          ctx.db.post.findMany({
            where: {
              content: {
                contains: where?.keyword ?? undefined
              },
              author: {
                email: where?.author_email ?? undefined
              },
            }
          }),
          args
        )
      }
    })
  }
})

// CREATE POST MUTATION
schema.inputObjectType({
  name: 'CreatePostInput',
  definition: t => {
    t.string('content', { required: true })
  }
})
schema.objectType({
  name: 'CreatePostPayload',
  definition: t => {
    t.field('post', { type: 'Post' })
  }
})
schema.extendType({
  type: 'Mutation',
  definition: t => {
    t.field('createPost', {
      type: 'CreatePostPayload',
      args: {
        input: schema.arg({
          type: 'CreatePostInput',
          required: true,
        })
      },
      resolve: async (_root, { input }, ctx) => {
        const userId = ctx.getUserId()
        if (!userId) throw new Error('Unauthorized')

        const post = await ctx.db.post.create({
          data: {
            content: input.content,
            author: {
              connect: {
                id: userId
              }
            }
          }
        })

        return {
          post
        }
      }
    })
  }
})

// UPDATE POST MUTATION
schema.inputObjectType({
  name: 'UpdatePostInput',
  definition: t => {
    t.string('content', {required: true })
    t.id('postId', { required: true })
  }
})
schema.objectType({
  name: 'UpdatePostPayload',
  definition: t => {
    t.field('post', { type: 'Post' })
  }
})

schema.extendType({
  type: 'Mutation',
  definition: t => {
    t.field('updatePost', {
      type: 'UpdatePostPayload',
      args: {
        input: schema.arg({
          type: 'UpdatePostInput',
          required: true
        })
      },
      resolve: async (root, { input }, ctx) => {
        const userId = ctx.getUserId()
        const { id: postId } = fromGlobalId(input.postId)
        const post = await ctx.db.post.findMany({
          where: {
            id: postId,
            userId: userId
          }
        })
        if (!post.length) throw new Error("no post record found!")
        const currentDate = JSON.stringify(new Date()).slice(1,-1)
        const newPost = await ctx.db.post.update({
          where: {
            id: postId,
          },
          data: {
            content: input.content,
            createdAt: currentDate
          }
        })
        return {
          post: newPost
        }
      }
    })
  }
})

// DELETE POST MUTATION
schema.inputObjectType({
  name:'DeletePostInput',
  definition: t => {
    t.id('id', { required: true })
  }
})

schema.objectType({
  name: 'DeletePostPayload',
  definition: t => {
    t.field('post', {type: 'Post'})
  }
})

schema.extendType({
  type: 'Mutation',
  definition: t => {
    t.field('deletePost', {
      type: 'DeletePostPayload',
      args: {
        input: schema.arg({
          type: 'DeletePostInput',
          required: true,
        })
      },
      resolve: async (_root, args, ctx) => {
        const userId = ctx.getUserId()
        const { id: postId } = fromGlobalId(args.input.id)
        const posts = await ctx.db.post.findMany({
          where: {
            id: postId,
            userId: userId,
          }
        })

        if (!posts.length) throw new Error("Not your fucking post")
        const deletedPost = await ctx.db.post.delete({
          where: { id: postId },
        })
        return {
          post: posts[0]
        }
      }
    })
  }
})
// LIKE POST MUTATION

schema.inputObjectType({
  name: 'LikePostInput',
  definition: t => {
    t.id('postId', { required: true })
  }
})

schema.objectType({
  name: 'LikePostPayload',
  definition: t => {
    t.field('post', { type: 'Post' })
    t.field('like', { type: 'Like' })
  }
})

schema.extendType({
  type: 'Mutation',
  definition: t => {
    t.field('likePost', {
      type: 'LikePostPayload',
      args: {
        input: schema.arg({
          type: 'LikePostInput',
          required: true,
        })
      },
      resolve: async(root, { input }, ctx) => {
        // check if user have already like the post
        const userId = ctx.getUserId()
        const { id: postId } = fromGlobalId(input.postId)
        
        const postLikedByUser = await ctx.db.like.findMany({
          where: {
            userId,
            postId,
          }
        })

        // throw error if they have liked the post
        if(postLikedByUser.length > 0) {
          throw new Error('like existed!')
        }

        // like the post and return
        const newLike = await ctx.db.like.create({
          data: {
            user: {
              connect: {
                id: userId
              }
            },
            post: {
              connect: {
                id:postId
              }
            }
          }
        })

        return {
          like: newLike,
          post: ctx.db.post.findOne({ where: { id: postId }})
        }
      }
    })
  }
})

// UNLIKE POST MUTATION

schema.inputObjectType({
  name: 'UnlikePostInput',
  definition: t => {
    t.id('postId', { required: true })
  }
})

schema.objectType({
  name: 'UnlikePostPayload',
  definition: t => {
    t.field('like', { type: 'Like' })
  }
})

schema.extendType({
  type: 'Mutation',
  definition: t => {
    t.field('unlikePost', {
      type: 'UnlikePostPayload',
      args: {
        input: schema.arg({
          type: 'UnlikePostInput',
          required: true,
        })
      },
      resolve: async(root, { input }, ctx) => {
        // check if user have already like the post
        const userId = ctx.getUserId()
        const { id: postId } = fromGlobalId(input.postId)
        
        const postLikedByUser = await ctx.db.like.findMany({
          where: {
            userId,
            postId,
          }
        })
        if(postLikedByUser.length === 0){
          throw new Error('no like record existed!')
        }
        await ctx.db.like.deleteMany({
          where:{
            postId: postId,
            userId: userId
          }
        })
        return {
          like: postLikedByUser
        }
      }
    })
  }
})