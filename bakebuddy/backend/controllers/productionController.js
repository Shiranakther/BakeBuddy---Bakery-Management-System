

export const getProductionData =  (req,res)=>{
         res.status(200).json({message:"get Production Data"})
        }

export const getCustomProductionData = (req,res)=>{
    res.status(200).json({message:"get One Production Data"})
}

export const createProduction = (req,res)=>{
    res.status(201).json({message:"Create Production"})
}

export const updateProduction = (req,res)=>{
    res.status(200).json({message:"Update Production"})
}

export const deleteProduction = (req,res)=>{
    res.status(200).json({message:"Delete Production"})
}