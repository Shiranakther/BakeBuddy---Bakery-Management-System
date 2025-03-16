import asyncHandler from "express-async-handler";
import Sales from "../models/salesModel.js";



export const createSales = asyncHandler(async (req, res) => {
    const sales = await Sales.create(req.body);
    res.status(201).json(sales);
});

export const viewAllSales = asyncHandler(async(req, res) => {
    const sales = await Sales.find(req.body); 
    res.status(200).json(sales); 
});

export const viewSalesById = asyncHandler(async (req, res) => {
        const sales = await Sales.findById(req.params.id);
        res.status(200).json(sales);
});

export const updateSales = asyncHandler(async (req, res) => {
    const sales = await Sales.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!sales) {
        res.status(404);
        throw new Error("Sales not found");
    }

    res.status(200).json(sales);
});

export const deleteSales = asyncHandler(async (req, res) => {
    const sales = await Sales.findByIdAndDelete(req.params.id);

    if (!sales) {
        res.status(404);
        throw new Error("Sales not found");
    }

    res.status(200).json({ message: "Sales deleted successfully" });
});

  