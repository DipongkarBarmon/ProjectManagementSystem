import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path"


const Path = path.join(process.cwd(),".env") 

dotenv.config({path:Path});

const config = {
  node_env : process.env.NODE_ENV,
  port : process.env.PORT,
  database_url : process.env.DATABASE_URL,
  frontend_url : process.env.FRONTEND_URL!,
  bcrypt_salt_rounds : process.env.BCRYPT_SALT_ROUNDS!,
  cloudinary_cloud_name:process.env.CLOUDINARY_CLOUD_NAME!,
	cloudinary_api_key:process.env.CLOUDINARY_API_KEY!,
	cloudinary_api_secret:process.env.CLOUDINARY_API_SECRET!,
  jwt_access_secret : process.env.JWT_ACCESS_SECRET!,
  jwt_refresh_secret : process.env.JWT_REFRESH_SECRET!,
  jwt_access_expiration : process.env.JWT_ACCESS_EXPIRATION!,
  jwt_refresh_expiration : process.env.JWT_REFRESH_EXPIRATION!,
  smtp_user : process.env.SMTP_USER!,
  smtp_sender : process.env.SMTP_SENDER!,
  smtp_password : process.env.SMTP_PASSWORD!,
  google_client_id :process.env.GOOGLE_CLIENT_ID!,
  bkash_base_url : process.env.BKASH_BASE_URL!,
  bkash_username : process.env.BKASH_USERNAME!,
  bkash_password : process.env.BKASH_PASSWORD!,
  bkash_app_key : process.env.BKASH_APP_KEY!,
  bkash_app_secret : process.env.BKASH_APP_SECRET!,
  bkash_callback_url : process.env.BKASH_CALLBACK_URL!,
  bkash_merchant_number: process.env.BKASH_MERCHANT_NUMBER!,
  super_admin_name : process.env.SUPER_ADMIN_NAME!,
  super_admin_email : process.env.SUPER_ADMIN_EMAIL!,
  super_admin_password : process.env.SUPER_ADMIN_PASSWORD!,
}
export default config

