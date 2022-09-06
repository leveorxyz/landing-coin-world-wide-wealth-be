const autogen = require("swagger-autogen")();
const outputFile = "./swagger/swagger-2.json";
const endpointsFiles = ["./routes/rent.route.ts"];

autogen(outputFile, endpointsFiles);
