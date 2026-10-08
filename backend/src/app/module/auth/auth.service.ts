import bcrypt from "bcryptjs"
import { prisma } from "../../lib/prisma"
import { IForgetPasswordPayload, IGoogleLoginPayload, ILoginPayload, IRegisterPayload, IResetPasswordPayload, IUser, IVerifyEmailPayload } from "./auth.interface"
import config from "../../config"
import { uploadToCloudinary } from "../../lib/cloudinary"
import { jwtUtiles } from "../../utils/jwt"
import { JwtPayload, SignOptions } from "jsonwebtoken"
import crypto from 'crypto'
import { redisClient } from "../../lib/redis"
import path from "path"
import ejs from 'ejs'
import { transporter } from "../../lib/nodemailer"
 
 
import { AuthProvider, UserStatus } from "../../../../generated/prisma/enums"

import { googleClient } from "../../lib/googleOAuth"
import { TokenPayload } from "google-auth-library"




const registerIntoDB = async(payload : IRegisterPayload,fileBuffer : Buffer) => {
    const {name, password} = payload
    const email = payload.email.trim().toLowerCase()
    if(!email || !password) {
       throw new Error("Email and Password must be provided!")
    }

    const existingUser = await prisma.user.findFirst({
       where : {
          email  
       }
    })
    
    if(existingUser) {
       throw new Error("All ready exist user with this email")
    }
   //  console.log("the salt is " ,config.bcrypt_salt_rounds)
    const hashedPasword = await bcrypt.hash(password,Number(config.bcrypt_salt_rounds))

    
    let cloudinaryResult;

    try {
        cloudinaryResult = await uploadToCloudinary(fileBuffer, 'user-avatars');
    } catch (uploadError) {
        throw new Error("Failed to upload avatar image to Cloudinary.");
    }

   if (!cloudinaryResult || !cloudinaryResult.secure_url) {
        throw new Error("Avatar upload completed but secure URL was not generated.");
    }


    const otpKey = `register-otp:${email}`
    const otp =crypto.randomInt(100000,1000000).toString()

    const expiration = 60 *5
    await redisClient.set(otpKey,otp, {
       expiration : {
         "type" : "EX",
         "value" :expiration
       }
    })

    const registerPayloadKey =  `register-data:${email}`
    const registerPayload = {
       name,
       email,
       password :hashedPasword,
       avatar : cloudinaryResult.secure_url,
       avatarPublicId : cloudinaryResult.public_id
    }

    
    await redisClient.set(registerPayloadKey,JSON.stringify(registerPayload), {
        expiration:{
            "type" :"EX",
            "value":expiration
        }
    })

    
    const templatePath = path.join( process.cwd(),'src/app/templates/register-otp-email.ejs');
    const templateData = {
       name,
       otp,
       expiresIn :expiration/60
    }
    const html = await ejs.renderFile(templatePath,templateData)

    await transporter.sendMail({
       from :`Dipongkar <${config.smtp_sender}>`,
       to : email,
       subject : "Verification OTP sent",
       html
    })
    
}

const verifyEmail = async(payload :IVerifyEmailPayload)=>{
     const {email,otp} = payload

     if(!otp) {
       throw new Error("OTP not found.Please provide opt!")
     }
     
     const user = await prisma.user.findUnique({
       where : { 
         email
       }
     })

     if(user){
       throw  new Error("User all ready registered with this email")
     }

     const otpKey = `register-otp:${email}`

     const redisOtp = await redisClient.get(otpKey)

     if(!redisOtp){
       throw new Error("Redis otp not found in redis")
     }
     
     if(otp!==redisOtp){
       throw new Error("Opt is not correct,Please provide correct otp!")
     }

     await redisClient.del(otpKey)

     const registerPayloadKey =  `register-data:${email}`
     
     const registerDataPayload = await redisClient.get(registerPayloadKey)
    
     if(!registerDataPayload) {
       throw new Error("Register data not found in Redis!")
     }

     const userData : IRegisterPayload = JSON.parse(registerDataPayload)

     const createUser = await prisma.user.create({
        data : {
          name:userData.name,
          email:userData.email,
          password : userData.password,
          avatar : userData.avatar,
          avatarPublicId :userData.avatarPublicId,
          emailVerified : true
        },
        omit : {
          password : true
        }
    })

    
    if(!createUser) {
       throw new Error("User create fail!")
    }
    
    await redisClient.del(registerPayloadKey)

    const templatePath = path.join(process.cwd(),'src/app/templates/user-welcome-email.ejs')
    const templateData = {
      name:createUser.name ,
      email,
      dashboardUrl:`${config.frontend_url}/dashboard`
    }

    const html =await ejs.renderFile(templatePath,templateData)

      await transporter.sendMail({
         from: `TaskFlow <${config.smtp_sender}>`,
         to: email,
         subject: "Welcome to Project Managment Saas 🎉",
         html
      });

    const jwtPayload = {
       userId : createUser.id,
       neme :  createUser.name,
       email : createUser.email,
       role : createUser.platformRole
    }

    const accessToken = jwtUtiles.createToken(
      jwtPayload,
      config.jwt_access_secret,
      config.jwt_access_expiration as SignOptions
    )

    const refreshToken = jwtUtiles.createToken(
      jwtPayload,
      config.jwt_access_secret,
      config.jwt_access_expiration as SignOptions
    )

    return {
      accessToken,
      refreshToken,
         createUser,
   }
   
     
}
 
const userloginFromBD = async(payload : ILoginPayload) => {
    const password = payload.password
    const email = payload.email.trim().toLowerCase()
    
    const user = await prisma.user.findFirst({
      where :{email}
    })

    if(!user) {
       throw new Error("User in not found!")
    }

    if(user.emailVerified === false){
       throw new Error("Email is not verified!")
    }

    if(user.status === 'BLOCKED') {
       throw new Error("User is Blocked!")
    }

    if(user.status === 'DELETED' || user.isDeleted === true) {
       throw new Error("User Id is deleted")
    }
 

    if(!user.password){
      throw new Error(
        "This account does not have password login enabled.Try with Google ,Facebook or others",
      );
    }

    const isPasswordMatched =await bcrypt.compare(password,user.password as string)

    if(!isPasswordMatched) {
       throw new Error("Invalid credentials")
    }

    const jwtPayload = {
       userId : user.id,
       neme :  user.name,
       email : user.email,
       role : user.platformRole
    }

    const accessToken = jwtUtiles.createToken(
      jwtPayload,
      config.jwt_access_secret,
      config.jwt_access_expiration as SignOptions
    )

    const refreshToken = jwtUtiles.createToken(
      jwtPayload,
      config.jwt_access_secret,
      config.jwt_access_expiration as SignOptions
    )

    return {
      accessToken,
      refreshToken,    
   }
}


const googleLogin = async(payload : IGoogleLoginPayload)=>{
    let googleIdTokenPayload : TokenPayload |null |undefined=null 
    try {
       const Ticket = await googleClient.verifyIdToken({
          idToken : payload.idToken,
          audience : config.google_client_id
       })
       googleIdTokenPayload = Ticket.getPayload()  
    } catch (error) {
       throw new Error("Invalid Google id Token!")
    }

    if(!googleIdTokenPayload){
      throw new Error("Invalid Google id Token!")
    }

     if(!googleIdTokenPayload.email){
      throw new Error("Invalid Google user Email!")
    }
     if(!googleIdTokenPayload.name){
      throw new Error("Invalid Google  user name!")
    }

    const isExistUser = await prisma.oAuthAccount.findUnique({
      where:{ 
         provider_providerAccountId :{
          provider :AuthProvider.GOOGLE,
          providerAccountId : googleIdTokenPayload.sub
         }
      }
    })
    
   

    if(!isExistUser) {
       const cradentialUser  = await prisma.user.findUnique({
          where : {
             email : googleIdTokenPayload.email
          }
       })

       if(cradentialUser) {
         //  if(cradentialUser.emailVerified === false) {
         //     throw new Error("User Email Not varified");
         //  }
          if(cradentialUser.status === UserStatus.BLOCKED){
             throw new Error("User is Blocked");
          }
          if(cradentialUser.isDeleted === true || cradentialUser.status === UserStatus.DELETED){
             throw new Error("User is Deleted");
          }

          await prisma.oAuthAccount.create({
             data : {
                userId : cradentialUser.id,
                provider : AuthProvider.GOOGLE,
                providerAccountId : googleIdTokenPayload.sub
             }
          })
          await prisma.user.update({
            where : {
                id :cradentialUser.id
            },
            data:{
               emailVerified : true
            }
          })
       }
       else {
            const user= await prisma.user.create({
             data :{
                name : googleIdTokenPayload.name,
                email : googleIdTokenPayload.email,
                emailVerified : true,
             }
          })

           await prisma.oAuthAccount.create({
            data :{
               userId: user.id,
               provider : AuthProvider.GOOGLE,
               providerAccountId:googleIdTokenPayload.sub
            }
          })
       }

    }
     
    const {name,email} =googleIdTokenPayload

    const templatePath = path.join(process.cwd(),'src/app/templates/user-welcome-email.ejs')
    const templateData = {
       name ,
      email,
      dashboardUrl:`${config.frontend_url}/dashboard`
    }

    const html =await ejs.renderFile(templatePath,templateData)

      await transporter.sendMail({
         from: `TaskFlow <${config.smtp_sender}>`,
         to: email,
         subject: "Welcome to Project Managment Saas 🎉",
         html
      });

      const newuser = await prisma.user.findUnique({
         where :{
            email
         }
      })

      if(!newuser) {
         throw new Error("User is not found")
      }

      const authAccount = await prisma.oAuthAccount.findMany({
          where:{
            userId : newuser.id
          }
      })

      if(!authAccount) {
          throw new Error("User AuthAccount Not Found")
      }

    const jwtPayload = {
       userId : newuser.id,
       neme :  newuser.name,
       email : newuser.email,
       role : newuser.platformRole
    }

    const accessToken = jwtUtiles.createToken(
      jwtPayload,
      config.jwt_access_secret,
      config.jwt_access_expiration as SignOptions
    )

    const refreshToken = jwtUtiles.createToken(
      jwtPayload,
      config.jwt_access_secret,
      config.jwt_access_expiration as SignOptions
    )

    return {
      accessToken,
      refreshToken,
      createUser: newuser,
      authAccount
   }
   


}



const refreshToken = async (token: string) => {
	const verifiedRefreshToken = jwtUtiles.varifyToken(
		token,
		config.jwt_refresh_secret,
	);

	if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
		throw new Error(
			config.node_env === "development"
				? verifiedRefreshToken.error
				: "Invalid refresh token",
		);
	}

	const data = verifiedRefreshToken.data as JwtPayload;

	const user = await prisma.user.findUnique({
		where: { id: data.userId },
	});

	if (!user || user.isDeleted || user.status !== UserStatus.ACTIVE) {
		throw new Error("User is inactive or not found");
	}

	const jwtPayload = {
		userId: user.id,
		name: user.name,
		email: user.email,
		role: user.platformRole,
	};

	const accessToken = jwtUtiles.createToken(
		jwtPayload,
		config.jwt_access_secret,
		config.jwt_access_expiration as SignOptions,
	);

	const refreshToken = jwtUtiles.createToken(
		jwtPayload,
		config.jwt_refresh_secret,
		config.jwt_refresh_expiration as SignOptions,
	);

	return {
		accessToken,
		refreshToken,
	};
};


const forgetPassword = async(payload : IForgetPasswordPayload)=>{
   const email = payload.email.trim().toLowerCase()

   const user = await prisma.user.findUnique({
      where :{
         email
      }
   })

   if(!user ){
      throw new Error("User is not found!")
   }

   if(user.status === UserStatus.BLOCKED){
      throw new Error("User is Blocked!")
   }

   if(user.status === UserStatus.DELETED || user.isDeleted === true){
       throw new Error("User is Deleted!")
   }

   const otp = crypto.randomInt(100000,1000000).toString()

   const otpKey =`forget-password-otp:${email}`
   const expiration=60*5
   await redisClient.set(otpKey,otp,{
       expiration : {
         "type" :"EX",
         "value":expiration
       }
   })

   const templatePath = path.join(process.cwd(),'src/app/templates/forget-password-otp.ejs')
    const templateData = {
      name :user.name ,
      email,
      otp,
      expiresIn: expiration/60,
    }

    const html =await ejs.renderFile(templatePath,templateData)

      await transporter.sendMail({
         from: `Project Managment Saas <${config.smtp_sender}>`,
         to: email,
         subject: "Reset Your TaskFlow Password",
         html,
      });
}

const resetPassword =async(payload : IResetPasswordPayload)=>{
    const email = payload.email.trim().toLowerCase()
    const {newPassword,otp} = payload
    const user = await prisma.user.findUnique({
       where : {
          email 
       }
    })

    if(!user) {
       throw new Error("User is Not Found")
    }
    
     const otpKey =`forget-password-otp:${email}`

     const redisOtp = await redisClient.get(otpKey)

     if(!redisOtp) {
       throw new Error("Otp is Not Found in Redis")
     }

     if(otp!== redisOtp){
       throw new Error("Otp is not Correct,Please provide correct otp")
     }

     const hashedPasword = await bcrypt.hash(newPassword,Number(config.bcrypt_salt_rounds))
   //   console.log(newPassword)
     console.log(hashedPasword)
     const updateUser = await prisma.user.update({
      where :{
         email
      },
      data:{
         password : hashedPasword
      },
     })

     await redisClient.del(otpKey)
     const templatePath = path.join(process.cwd(),'src/app/templates/reset-password-email.ejs')
    const templateData = {
      name : updateUser.name
    }

    const html =await ejs.renderFile(templatePath,templateData)

      await transporter.sendMail({
         from: `Project Managment Saas <${config.smtp_sender}>`,
         to: email,
         subject: "Your TaskFlow Password Was Reset Successfully",
         html,
      });
     
    
}
export const AuthService = {
   registerIntoDB,
   verifyEmail,
   userloginFromBD,
   googleLogin,
   refreshToken,
   forgetPassword,
   resetPassword
}