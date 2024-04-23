
export async  function TryError(funct){
    try{
        return await funct()
    }
    catch(error){
        
       
    }
}