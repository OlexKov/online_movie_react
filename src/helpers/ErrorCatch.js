
export const  TryError = (funct)=>{
       return funct().catch(error=>error)
}