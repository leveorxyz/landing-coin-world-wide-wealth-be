import { Property } from "@prisma/client";
import { Request, Response } from "express";
import {
  findPropertyById,
  findAllProperties,
  createNewProperty,
  updateProperty,
} from "../datasource/property.datasource";
import { getAllRentByPropertyId } from "../datasource/rent.datasource";
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
    const properties = (await findAllProperties()) || [];
    const result = [];
    for (let i in properties) {
      result.push({
        ...properties[i],
        rentCollected: (await getAllRentByPropertyId(properties[i].id))?.reduce(
          (a, b) => a + b.rent,
          0
        ),
      });
    }
    return wrappedResponse(res, "Properties found successfully", 200, result);
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

export const updateTenantStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { tenantStatus } = req.body;
    const property = await findPropertyById(id);
    if (property) {
      const updateTenant = await updateProperty(id, tenantStatus);
      return wrappedResponse(
        res,
        "Tenant status updated successfully",
        200,
        updateTenant
      );
    }
    return wrappedResponse(res, "Property not found", 404, null);
  } catch (e: any) {
    return wrappedResponse(res, e.message, 500, null);
  }
};
