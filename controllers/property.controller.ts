import { Property } from "@prisma/client";
import { Request, Response } from "express";
import {
  findPropertyById,
  findAllProperties,
  createNewProperty,
} from "../datasource/property.datasource";
import { wrappedResponse } from "../utils/functions";

export const createProperty = async (req: Request, res: Response) => {
  try {
    const {
      name,
      boughtFrom,
      price,
      location,
      image,
      legalDoc,
      tenantStatus,
      rentDueDate,
    } = req.body as Property;
    const property = await createNewProperty(
      name,
      boughtFrom,
      price,
      location,
      image,
      legalDoc,
      tenantStatus,
      rentDueDate
    );
    return wrappedResponse(res, "Property created successfully", 201, property);
  } catch (e: any) {
    return wrappedResponse(res, e.message, 500, null);
  }
};

export const getAllProperties = async (req: Request, res: Response) => {
  try {
    const properties = await findAllProperties();
    return wrappedResponse(
      res,
      "Properties found successfully",
      200,
      properties
    );
  } catch (e: any) {
    return wrappedResponse(res, e.message, 500, null);
  }
};

export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const property = await findPropertyById(id);
    return wrappedResponse(res, "Property found successfully", 200, property);
  } catch (e: any) {
    return wrappedResponse(res, e.message, 500, null);
  }
};
