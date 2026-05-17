import { ApiError } from "./api-error.js"

export const cosineSimilarity = (vecA, vecB)=>{
   if(vecA.length !== vecB.length){
     throw new ApiError(400,"Vector dimensions do not match");
   }

   let dotProduct = 0;
   let normA = 0;
   let normB = 0;

   for(let i = 0; i < vecA.length; i++){
    dotProduct += vecA[i]*vecB[i];
    normA += vecA[i] * vecA[i];
    normB = vecB[i] * vecB[i];
   }

   return dotProduct / (Math.sqrt(normA)*Math.sqrt(normB));
}