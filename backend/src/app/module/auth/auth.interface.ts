import { PlatformRole, UserStatus } from "../../../../generated/prisma/enums"


export interface IRegisterPayload {
   name : string,
   email : string,
   password : string,
   avatar? : string,
   avatarPublicId?:string
}

export interface IVerifyEmailPayload {
     email : string,
     otp : string
}

export interface ILoginPayload {
    email : string,
    password: string
}

export interface IGoogleLoginPayload {
    idToken : string
}
export interface IForgetPasswordPayload {
     email : string
}

export interface IResetPasswordPayload {
   email : string,
   newPassword: string,
   otp: string
}


export interface IUser {
 id: string,
 createdAt?: Date;
 updatedAt?: Date;
 email: string;
 name: string;
 password: string | null;
 avatar: string | null;
 avatarPublicId: string | null;
 platformRole: PlatformRole;
 isActive: boolean;
 emailVerified: boolean;
 status: UserStatus;
 isDeleted?: boolean;
 deletedAt?: Date | null;

}