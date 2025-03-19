import Production from "../models/productionModel.js"

export const getProductionData =  async (req,res)=>{

    try{
        const production = await Production.find();
        res.status(200).json(production)
    }catch(e){
        console.log(e)
    }
}    

export const getCustomProductionData = async (req,res)=>{
    const production = await Production.findById(req.params.id);
    try{
    if(!production){
        res.status(404);
        throw new Error("Production Not Found");
    }
    res.status(200).json(production)

    }catch(e){
        console.log(e);

    }
    
}

export const createProduction = async (req,res)=>{
    let {productCode,productName,date,quantity,remarks} = req.body;

    if(!productCode ||!productName || !quantity ){
        res.status(400).json({msg:"Please enter all fields"})
    }

    if (!date) {
        date = new Date(); // Use current timestamp if date is missing
    }

    try{
        const production = await Production.create(
            {
            productCode,
            productName,
            date,
            quantity,
            remarks
            }

        );
        res.status(201).json(production)
    }catch(e){
        console.log(e);
        res.status(500).json({ msg: "Error creating production" });
    }
    
}






export const updateProduction = async (req,res)=>{
    const production = await Production.findById(req.params.id);
    if(!production){
        res.status(404);
        throw new Error("Production Not Found");
    }
    try{
    const updatedProduction = await Production.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    )
    res.status(200).json(updatedProduction)

    }catch(e){
        console.log(e);
        res.status(500).json({ msg: "Error Updating production" });

    }
}

export const deleteProduction = async (req,res)=>{
    const production = await Production.findById(req.params.id);
    if(!production){
        res.status(404);
        throw new Error("Production Not Found");
    }
    try{
    await Production.deleteOne();
    res.status(200).json(production)

    }catch(e){
        console.log(e);
        res.status(500).json({ msg: "Error Deleting production" });

    }
}