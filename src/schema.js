const { gql } = require('apollo-server');

module.exports = gql`
  type User {
    displayName: String!
    avatarUrl: String!
  }

  type Gif {
    id: String!
    title: String!
    url: String!
    urlSmall: String!
    source: String
    user: User
  }

  type Query {
    # GIPHY Search gives you instant access to our library of millions of GIFs by entering a word or phrase.
    gifs(search: String!, limit: Int = 25, offset: Int = 0): [Gif!]!

    # GIPHY Trending returns a list of the most relevant and engaging content each and every day.
    trendingGifs(limit: Int = 25, offset: Int = 0): [Gif!]!

    # GIPHY Random lets you add some weirdness to the conversation by returning a single random GIF related to the word or phrase entered. If no tag is specified, the GIF returned is completely random.
    randomGif(search: String): Gif!

    # Get GIF by ID returns a GIF’s metadata based on the GIF ID specified.
    gif(id: String!): Gif!
  }
`;
