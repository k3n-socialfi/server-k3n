export const TwitterEndpoints = {
  // TWEET LOOKUP
  SINGLE_TWEET: 'https://api.twitter.com/2/tweets/:id',
  SINGLE_TWEET_USER_CONTEXT: 'https://api.twitter.com/2/tweets/:id',
  MULTIPLE_TWEETS: 'https://api.twitter.com/2/tweets?ids=',

  // USER LOOKUP
  USER_BY_ID: 'https://api.twitter.com/2/users/:id',
  USERS_BY_ID: 'https://api.twitter.com/2/users?ids=',
  USER_BY_USERNAME: 'https://api.twitter.com/2/users/by/username/',
  USERS_BY_USERNAME: 'https://api.twitter.com/2/users/by?usernames=',

  // FOLLOWS
  FOLLOWERS_OF_USER: 'https://api.twitter.com/2/users/:id/followers',
  USERS_A_USER_ID_IS_FOLLOWING: 'https://api.twitter.com/2/users/:id/following',
  FOLLOWER_LOOKUP: 'https://api.twitter.com/2/lists/:id/followers',
  USER_IS_FOLLOWED_LISTS: 'https://api.twitter.com/2/users/:id/followed_lists',

  // LIKES
  LIKED_TWEET: 'https://api.twitter.com/2/users/:id/liked_tweets',
  LIKING_USERS: 'https://api.twitter.com/2/tweets/:id/liking_users',

  // RETWEETS
  RETWEETED_BY: 'https://api.twitter.com/2/tweets/:id/retweeted_by'
};

export const RapidApiEndpoints = {
  //USER
  USER_DETAILS: 'https://twitter154.p.rapidapi.com/user/details',

  // FOLLOWS
  USER_FOLLOWING: 'https://twitter154.p.rapidapi.com/user/following',

  USER_FOLLOWERS: 'https://twitter154.p.rapidapi.com/user/followers'
};
