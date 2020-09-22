import { schema } from 'nexus';
import * as fs from 'fs'
import * as path from 'path'

schema.objectType({
  name: 'Avatar',
  definition: t => {
    t.implements('Node')
    t.model.url()
    t.model.user()
    t.model.userId()
  }
})

//CREATE AVATAR
schema.scalarType({
  name: 'File',
  parseValue: async value => {
    return value
  },
  serialize: value => {
    
  },
  parseLiteral: value => {
  }
})

schema.objectType({
  name: 'CreateAvatarPayload',
  definition: t => {
    t.field('avatar', { type: 'Avatar' })
  }
})

schema.extendType({
  type: 'Mutation',
  definition: t => {
    t.field('createAvatar', {
      type: 'CreateAvatarPayload',
      args: {
        file: schema.arg({
          type: 'File',
          required: true
        })
      },
      resolve: async (_root, { file }, ctx) => {
        const userId = ctx.getUserId()
        const acceptedType = ['png', 'jpeg', 'jpg']
        if (!userId) throw new Error('Unauthorized')
        const checkExistedFile = await ctx.db.user.findOne({
          where: {
            id: userId
          }
        }).avatar()
        if(checkExistedFile) throw new Error('Avatar already existed!')
        const data = await file
        const fileType = data.mimetype.substring(data.mimetype.indexOf('/') + 1, data.mimetype.length)
        if(!acceptedType.includes(fileType)) throw new Error('file extension not supported!')
        await new Promise((resolve, reject) =>
          data.createReadStream().pipe(
              fs.createWriteStream(
                path.join(__dirname, `../../public`, `${userId}_${data.filename}`)
              )
            )
            .on("close", resolve)
        )
        const avatar = await ctx.db.avatar.create({
          data: {
            url: `${process.cwd()}\\public\\${userId}_${data.filename}`,
            user: {
              connect: {
                id: userId
              }
            }
          }
        })
        return {
          avatar
        }
      }
    })
  }
})

//DELETE AVATAR
schema.objectType({
  name: 'DeleteAvatarPayload',
  definition: t => {
    t.field('avatar', { type: 'Avatar' })
  }
})

schema.extendType({
  type: 'Mutation',
  definition: t => {
    t.field('deleteAvatar', {
      type: 'DeleteAvatarPayload',
      resolve: async(_root, _args, ctx) => {
        const userId = ctx.getUserId()
        if (!userId) throw new Error('Unauthorized')
        const avatar = await ctx.db.avatar.findMany({
          where: {
            userId: userId
          }
        })
        if(!avatar.length) throw new Error('No avatar existing!')
        fs.unlink(avatar[0].url, err => {
          if(err) throw err
        })
        await ctx.db.avatar.deleteMany({
          where: {
            userId: userId
          }
        })
        return {
          avatar: avatar[0]
        }
      }
    })
  }
})
