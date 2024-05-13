import jwt from 'jsonwebtoken'
import config from 'config'

const accessTokenSecretKey = config.get<string>('accessTokenSecretKey')
const refreshTokenSecretKey = config.get<string>('refreshTokenSecretKey')
const acccessTokenExpiry = config.get<string>('accessTokenTtl')
const refreshTokenExpiry = config.get<string>('refreshTokenTtl')

type TokenType = 'access' | 'refresh'

const getSecretToken = (tokenType: TokenType) => {
  return tokenType === 'access' ? accessTokenSecretKey : refreshTokenSecretKey
}

const getExpiresInValue = (tokenType: TokenType) => {
  return tokenType === 'access' ? acccessTokenExpiry : refreshTokenExpiry
}

export const signJwt = (
  object: Object,
  tokenType: TokenType,
  options: jwt.SignOptions = {}
) => {
  return jwt.sign(object, getSecretToken(tokenType), {
    ...options,
    expiresIn: getExpiresInValue(tokenType)
    // algorithm: 'RS256'
  })
}

export const verifyJwt = (token: string, tokenType: TokenType = 'access') => {
  try {
    const decoded = jwt.verify(token, getSecretToken(tokenType))
    return {
      valid: true,
      expired: false,
      decoded
    }
  } catch (error: any) {
    return {
      valid: false,
      expired: error.message === 'jwt expired',
      decoded: null
    }
  }
}
