type Demo = {
  message: string;
};

type GlobalResponse = {
  message: string;
  statusCode: Number;
  result: Object | null | string;
};

type JWTPayload = {
  id: string;
  iat: number | undefined;
  exp: number | undefined;
};

type TokenBuyPayload = {
  publicAddress: string;
  amount: string;
};

type RentCollectionPayload = {
  propertyId: string;
};
