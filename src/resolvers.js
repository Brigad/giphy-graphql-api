const camelcase = require('lodash.camelcase');
const fetch = require('node-fetch');
const qs = require('qs');

const API_KEY = 'mhvsVNNQYN2u4QqKd8EYvyOVLt9Zu8Ef';

const user = {
  displayName: 'JoeCool4000',
  avatarUrl: 'https://media1.giphy.com/avatars/election2016/XwYrZi5H87o6.gif',
};

const gifWithoutUser = {
  id: 'YsTs5ltWtEhnq',
  title: 'Happy Dancing GIF',
  url: 'http://giphy.com/gifs/confused-flying-YsTs5ltWtEhnq',
  embedUrl: 'http://giphy.com/embed/YsTs5ltWtEhnq',
  source:
    'http://www.reddit.com/r/reactiongifs/comments/1xpyaa/superman_goes_to_hollywood/',
};
const gifWithUser = {
  id: 'YsTs5ltWtEhnq',
  title: 'Happy Dancing GIF',
  url: 'http://giphy.com/gifs/confused-flying-YsTs5ltWtEhnq',
  embedUrl: 'http://giphy.com/embed/YsTs5ltWtEhnq',
  source:
    'http://www.reddit.com/r/reactiongifs/comments/1xpyaa/superman_goes_to_hollywood/',
  user,
};

const gifs = [gifWithoutUser, gifWithUser];

const stringifyObject = obj => {
  if (!obj || !Object.keys(obj)) {
    return '';
  }

  return qs.stringify(obj);
};

const stringifyQueryParameters = queryParameters => {
  const stringified = stringifyObject(queryParameters);

  return stringified ? `?${stringified}` : '';
};

const camelcaseObjectKeys = object =>
  Object.entries(object).reduce(
    (prev, [key, value]) => ({
      ...prev,
      [camelcase(key)]:
        typeof value === 'object' ? camelcaseObjectKeys(value) : value,
    }),
    {},
  );

const transformGifObject = gifObject =>
  camelcaseObjectKeys({
    ...gifObject,
    url: `https://media.giphy.com/media/${gifObject.id}/giphy.gif`,
    urlSmall: `https://media.giphy.com/media/${gifObject.id}/200w_d.gif`,
  });

module.exports = {
  Query: {
    gifs: async (_, { search, limit, offset }) => {
      const query = {
        api_key: API_KEY,
        q: search,
        limit,
        offset,
      };
      const res = await fetch(
        `https://api.giphy.com/v1/gifs/search${stringifyQueryParameters(
          query,
        )}`,
      );
      const { data } = await res.json();
      return data.map(transformGifObject);
    },
    trendingGifs: async (_, { search, limit, offset }) => {
      const query = {
        api_key: API_KEY,
        limit,
        offset,
      };
      const res = await fetch(
        `https://api.giphy.com/v1/gifs/trending${stringifyQueryParameters(
          query,
        )}`,
      );
      const { data } = await res.json();
      return data.map(transformGifObject);
    },
    randomGif: async (_, { search }) => {
      const query = {
        api_key: API_KEY,
        tag: search,
      };
      const res = await fetch(
        `https://api.giphy.com/v1/gifs/random${stringifyQueryParameters(
          query,
        )}`,
      );
      const { data } = await res.json();
      return transformGifObject(data);
    },
    gif: async (_, { id }) => {
      const query = {
        api_key: API_KEY,
      };
      const res = await fetch(
        `https://api.giphy.com/v1/gifs/${id}${stringifyQueryParameters(query)}`,
      );
      const { data } = await res.json();
      return transformGifObject(data);
    },
  },
};
