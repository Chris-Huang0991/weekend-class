import { createTestContext } from './__helpers'

const ctx = createTestContext()

describe('User', () => {
  test('Signup mutation', async () => {
    const signupPayload = await signupMutation(ctx, {
      email:'test@gmail.com',
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
          email: '123@gmail.com',
          password: '1232',
          name: 'test'
      }
    }
    )
    console.log(payload)
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