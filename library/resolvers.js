const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const { v1: uuid } = require('uuid')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
  Query: {
    authorCount: async () => Author.collection.countDocuments(),
    bookCount: async (root, args) => {
      if (!args.author) {
        return Book.collection.countDocuments({})
      }
      const target = await Author.findOne({ name: args.author })
      const res = await Book.collection.countDocuments({ author: target._id })
      return res
    },
    allBooks: async (root, args) => {
      if (!args.genre || args.genre === '') {
        const res = await Book.find({}).populate('author')
        return res
      }
      const filtRes = await Book.find({ genres: args.genre }).populate('author')
      return filtRes
    },
    allAuthors: async (root) => {
      const res = await Author.aggregate([
        {
          $project: {
            name: 1,
            born: 1,
            bookCount: {
              $cond: {
                if: { $isArray: '$bookCount' },
                then: { $size: '$bookCount' },
                else: 'NA',
              },
            },
          },
        },
      ])
      return res
    },
    me: (root, args, context) => {
      return context.currUser
    },
  },
  Mutation: {
    createUser: async (root, args) => {
      if (await User.exists({ username: args.username })) {
        throw new GraphQLError(`User ${args.username} already exists`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error,
          },
        })
      }
      const user = new User({ ...args })

      return user.save().catch((error) => {
        throw new GraphQLError('Failed to create user', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error,
          },
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'password') {
        throw new GraphQLError('invalid credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
    addBook: async (root, args, context) => {
      let id = null
      let book = null

      const currUser = context.currUser

      if (!currUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      try {
        const authorId = await Author.exists({ name: args.author })
        if (authorId) {
          const author = await Author.findOne({ _id: authorId })
          book = new Book({ ...args, author: authorId })
          await book.save()
          author.bookCount = author.bookCount.concat(book._id)
          await author.save()
        } else {
          const newAuthor = new Author({ name: args.author })
          await newAuthor.save()
          const newAuthorId = await Author.exists({ name: args.author })
          book = new Book({ ...args, author: newAuthorId })
          await book.save()
          newAuthor.bookCount = newAuthor.bookCount.concat(book._id)
          await newAuthor.save()
        }
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: error,
          },
        })
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book.populate('author') })

      return book.populate('author')
    },
    editAuthor: async (root, args, { currUser }) => {
      if (!currUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const author = await Author.findOne({ name: args.name })
      const updAuthor = { ...author._doc, born: args.setBornTo }
      const changed = await Author.findByIdAndUpdate(author._id, updAuthor, {
        new: true,
      })
      return changed
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED'),
    },
  },
}

module.exports = resolvers
