import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'
import { Result } from 'pg'
import { success } from 'zod'


const createToken = (jwtPayload :JwtPayload , secret : string,expiresIn : SignOptions ) => {
     const token = jwt.sign(jwtPayload,secret,expiresIn)

     return token
}


const varifyToken = (token : string, secret : string) => {
   try {
      const varifiedToken = jwt.verify(token,secret) 
      return {
         success : true,
         data : varifiedToken
      }
   } catch (error : any) {
      console.log("Token varification failed :", error)
      return {
         success : false,
         error : error.message
      }
   }
       
}

export  const jwtUtiles = {
   createToken,
   varifyToken
}