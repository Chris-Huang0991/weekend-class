import { createTestContext } from './__helpers'

const ctx = createTestContext()

describe('User', () => {
  test('Signup mutation', async () => {
    const signupPayload = await signupMutation(ctx, {
      email:'tes2t@gmail.com',
      password: 'asdasd',
      name: 'test'
    })
    expect(signupPayload).toHaveProperty('signup')
    expect(signupPayload.signup).toHaveProperty('token')
    expect(signupPayload.signup).toHaveProperty('user')
  })

  test('sign up check payload', async () => {
    const payload = await ctx.client.send(
      ` mutation($input: SignupInput!) {
        signup(input: $input) {
          token
          user {
            id
          }
        }
      }
      `,
      {
        input: {
          email: '1223@gmail.com',
          password: '1232',
          name: 'test'
      }
    }
    )
    expect(payload).toHaveProperty('signup')
  })

  test('check signup twice', async () => {
    const payload = await ctx.client.send(
      ` mutation($input: SignupInput!) {
        signup(input: $input) {
          token
          user {
            id
          }
        }
      }
      `,
      {
        input: {
          email: '123@gmail.com',
          password: '1232',
          name: 'test'
      }
    }
    ).catch((err: any)=>{
      expect(err)
    })
    
  })

  test('login', async () => {
    const payload = await ctx.client.send(
      ` mutation($input: LoginInput!) {
        login(input: $input) {
          token
          user {
            id
          }
        }
      }
      `,
      {
        input: {
          email: '1223@gmail.com',
          password: '1232',
      }
    }
    )
    expect(payload).toHaveProperty('login')
    expect(payload.login).toHaveProperty('token')
    expect(payload.login).toHaveProperty('user')
  })

  test('get user from node', async () => {
    const getUserId = await ctx.client.send(
      ` mutation($input: LoginInput!) {
        login(input: $input) {
          token
          user {
            id
          }
        }
      }
      `,
      {
        input: {
          email: '1223@gmail.com',
          password: '1232',
      }
    }
    )
    const UserId = getUserId.login.user.id
    const payload = await ctx.client.send(
      ` query($id: ID!) {
        node(id: $id) {
         ... on User {
           id
           email
         }
        }
      }
      `,
      {
          id: UserId,
    }
    )
    expect(payload).toHaveProperty('node')
    expect(payload.node).toHaveProperty('id')
    expect(payload.node).toHaveProperty('email')
  })

})

//sign up a user
// login the user
  //check input
  //check payload
//node(id: ID!) to get the user
  //check payload

const signupMutation = (ctx: any, input: any) => {
  return ctx.client.send (
    ` mutation($input: SignupInput!) {
      signup(input: $input) {
        token
        user {
          id
        }
      }
    }
    `,
    { input }
  )
}

describe('Post', () => {
  test('create post', async () => {
    const loginPayload = await ctx.client.send(
      ` mutation($input: LoginInput!) {
        login(input: $input) {
          token
          user {
            id
          }
        }
      }
      `,
      {
        input: {
          email: '1223@gmail.com',
          password: '1232',
        }
      }
    )
    const token = loginPayload.login.token
    await ctx.client.headers.set("authorization", 
    `Bearer ${token}`)
    const payload = await ctx.client.send(
      ` mutation($input: CreatePostInput!) {
        createPost(input: $input) {
          post {
            id
            content
            author {
              id
            }
            createdAt
          }
        }
      }
      `,
      {
        input: {
          content: 'test'
      }
    }
    )
    expect(payload).toHaveProperty('createPost')
    expect(payload.createPost).toHaveProperty('post')
    expect(payload.createPost.post).toHaveProperty('content')
  })

  
  test('update post', async () => {
    const loginPayload = await ctx.client.send(
      ` mutation($input: LoginInput!) {
        login(input: $input) {
          token
          user {
            id
          }
        }
      }
      `,
      {
        input: {
          email: '1223@gmail.com',
          password: '1232',
      }
    }
    )
    const token = loginPayload.login.token

    const postPaylod = await ctx.client.send(
      ` query($where: PostConnetWhereInput!) {
        login(input: $input) {
          token
          user {
            id
          }
        }
      }
      `,
      {
        input: {
          email: '1223@gmail.com',
          password: '1232',
      }
    }
    )

    await ctx.client.headers.set("authorization", 
    `Bearer ${token}`)
    const payload = await ctx.client.send(
      ` mutation($input: UpdatePostInput!) {
        updatePost(input: $input) {
          post {
            id
            content
            createdAt
          }
        }
      }
      `,
      {
        input: {
          postId: 'UG9zdDpja2ZmYXJ0cTIwMDgydXJ2OGVsbWx1cTU2',
          content: 'asdsa'
      }
    }
    )
    expect(payload).toHaveProperty('updatePost')
    expect(payload.updatePost).toHaveProperty('post')
    expect(payload.updatePost.post).toHaveProperty('content')
    expect(payload.updatePost.post.content).toEqual('asdsa')
  })

  // test('delete post', async () => {
  //   const loginPayload = await ctx.client.send(
  //     ` mutation($input: LoginInput!) {
  //       login(input: $input) {
  //         token
  //         user {
  //           id
  //         }
  //       }
  //     }
  //     `,
  //     {
  //       input: {
  //         email: '1223@gmail.com',
  //         password: '1232',
  //     }
  //   }
  //   )
  //   const token = loginPayload.login.token
  //   await ctx.client.headers.set("authorization", 
  //   `Bearer ${token}`)
  //   const payload = await ctx.client.send(
  //     ` mutation($input: DeletePostInput!) {
  //       deletePost(input: $input) {
  //         post {
  //           id
  //           content
  //           createdAt
  //         }
  //       }
  //     }
  //     `,
  //     {
  //       input: {
  //         id: 'UG9zdDpja2ZmYWltb2IwMDYxdXJ2OGJrNTNnNmJm'
  //     }
  //   }
  //   )
  //   expect(payload).toHaveProperty('deletePost')
  //   expect(payload.deletePost).toHaveProperty('post')
  //   expect(payload.deletePost.post).toHaveProperty('content')
  // })
  
})

// describe('like', () => {
//   const loginPayload = await ctx.client.send(
//     ` mutation($input: LoginInput!) {
//       login(input: $input) {
//         token
//         user {
//           id
//         }
//       }
//     }
//     `,
//     {
//       input: {
//         email: '1223@gmail.com',
//         password: '1232',
//     }
//   }
//   )
//   const token = loginPayload.login.token
//   await ctx.client.headers.set("authorization", 
//   `Bearer ${token}`)
//     const payload = await ctx.client.send(
//       ` mutation($input: LikePostInput!) {
//         likePost(input: $input) {
//           post {
//             id
//             content
//           }
//           like {
//             id
//           }
//         }
//       }
//       `,
//       {
//         input: {
//           postId: 'UG9zdDpja2ZmYXJ0cTIwMDgydXJ2OGVsbWx1cTU2',
//       }
//     }
//     )
//     expect(payload).toHaveProperty('likePost')
//     expect(payload.likePost).toHaveProperty('post')
//     expect(payload.likePost).toHaveProperty('like')
//   })


//     test('unlike post', async () => {
//       await ctx.client.headers.set("authorization", 
//       "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJja2ZmOTllN3cwMDIwdXJ2OGhsemZvamt6IiwiaWF0IjoxNjAwODU5NTM0fQ.kknToiF2EsymBrc27ikCWJV1V_VjA8_IOSg3RvxTTe0")
//       const payload = await ctx.client.send(
//         ` mutation($input: UnlikePostInput!) {
//           unlikePost(input: $input) {
//             like {
//               id
//             }
//           }
//         }
//         `,
//         {
//           input: {
//             postId: 'UG9zdDpja2ZmYXJ0cTIwMDgydXJ2OGVsbWx1cTU2',
//         }
//       }
//       )
//       expect(payload).toHaveProperty('unlikePost')
//       expect(payload.unlikePost).toHaveProperty('like')
//     })
// })