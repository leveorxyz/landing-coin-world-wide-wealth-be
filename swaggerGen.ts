const autogen = require("swagger-autogen")();
const outputFile = "./swagger/swagger.json";
const endpointsFiles = ["./index.ts"];

autogen(outputFile, endpointsFiles);
