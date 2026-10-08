import {v2 as cloudinary, UploadApiResponse }from 'cloudinary'
import config from '../config'
import streamifier from 'streamifier'

cloudinary.config ({
   cloud_name : config.cloudinary_cloud_name,
   api_key : config.cloudinary_api_key,
   api_secret : config.cloudinary_api_secret,
   secure : true
})

/*
  streamifier is a simple Node.js utility library that converts Buffers (and Strings) into readable streams.

  In your application, when you use Multer with Memory Storage, the uploaded file is loaded completely into your server's RAM as a raw Buffer (req.file.buffer). However, cloud services like Cloudinary require a streaming data source (ReadableStream) to accept files efficiently without crashing your server. streamifier bridges this gap.

  Why do we need it?

  Without it: You would have to save the file onto your server's hard drive first, read it using Node's fs.createReadStream(), upload it to Cloudinary, and then remember to delete the local file.

  With it: The file stays entirely in RAM, turns into a stream on the fly, and sends directly to Cloudinary. It is much faster and doesn't pollute your server's hard drive.

  npm install streamifier
  npm install --save-dev @types/streamifier

 */

export const uploadToCloudinary = (fileBuffer :Buffer, folderName : string ='uploads'): Promise<UploadApiResponse> => {
     return new Promise((resolve,reject) => {
         const cldStream = cloudinary.uploader.upload_stream(
            {
               folder : folderName,
               resource_type : 'auto',
               format : 'webp', //Forces Cloudinary to convert the incoming file into WebP
               transformation : [
                 {
                  quality : 'auto' // Optional: balances file size and clear visual quality
                 }
               ]
            },
            (error,result) => {
               if(error){
                return reject(error)
               }
               if(!result){
                 return reject(new Error("No result return from cloudinary!"));
                }

               return resolve(result)
            }
         )
          // 2. Use streamifier to read your RAM buffer 
        // 3. Use .pipe() to push the data directly into the Cloudinary stream
         streamifier.createReadStream(fileBuffer).pipe(cldStream)
     })
}



export const deleteFromCloudinary = async(publicId : string) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        if (result.result !== 'ok') {
            throw new Error(`Failed to delete image with public ID: ${publicId}`);
        }
    } catch (error : any) {
        throw new Error(`Error deleting image from Cloudinary: ${error.message}`);
    }
}; 