// export default {
//   port: 3000,
//   // dbUri: 'mongodb+srv://professionalworks78023:itJtiU7TqoF5d9xG@cluster0.3cbfscl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
//   dbUri: process.env.MONGO_URI,
//   saltWorkFactor: process.env.SALT_WORK_FACTOR,

//   // use RSA Private and Public key  : i.e. ____RSA Private key____, ____RSA Public Key____
//   // if you want to use RS256 encryption for signing jWT

//   accessTokenSecretKey: process.env.ACCESS_TOKEN_SECRET_KEY,
//   refreshTokenSecretKey: process.env.REFRESH_TOKEN_SECRET_KEY,
//   accessTokenTtl: process.env.ACCESS_TOKEN_TTL,
//   refreshTokenTtl: process.env.REFRESH_TOKEN_TTL
// }

export default {
  port: 3000,
  dbUri:
    'mongodb+srv://professionalworks78023:itJtiU7TqoF5d9xG@cluster0.3cbfscl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  saltWorkFactor: 10,

  // use RSA Private and Public key  : i.e. ____RSA Private key____, ____RSA Public Key____ 
  // if you want to use RS256 encryption for signing jWT

  accessTokenSecretKey: 'some-public-key',
  refreshTokenSecretKey: 'some-public-key',
  accessTokenTtl: '15min',
  refreshTokenTtl: '1hr'
}
