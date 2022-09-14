import { Property } from "@prisma/client";
import { Request, Response } from "express";
import {
  findPropertyById,
  findAllProperties,
  createNewProperty,
  updateProperty,
  updatePropertyDueDate,
} from "../datasource/property.datasource";
import { getAllRentByPropertyId } from "../datasource/rent.datasource";
import { generateNextDueDate, wrappedResponse } from "../utils/functions";
import { landingTokenContract, web3 } from "../utils/web3.utils";

const stringHex = require("string-hex");

export const createProperty = async (req: Request, res: Response) => {
  try {
    const { name, boughtFrom, price, location, image, legalDoc, tenantStatus } =
      req.body as Property;
    const property = await createNewProperty(
      name,
      boughtFrom,
      price,
      location,
      image,
      legalDoc,
      tenantStatus
    );

    landingTokenContract.methods
      .addProperty(
        property.id,
        "0x" + stringHex(property.image),
        "0x" + stringHex(property.legalDoc)
      )
      .send({
        gas: 2600000,
        gasPrice: 3650000000,
        from: web3.eth.defaultAccount,
      });

    return wrappedResponse(res, "Property created successfully", 201, property);
  } catch (e: any) {
    console.log(e);
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
    const { tenantStatus, dueDate } = req.body;
    const property = await findPropertyById(id);
    if (property) {
      if (tenantStatus) {
        let nextDate = dueDate ?? generateNextDueDate();
        await updatePropertyDueDate(property.id, nextDate);
      } else {
        await updatePropertyDueDate(property.id, null);
      }
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
