import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamodbClient";

interface IUserCertificate {
  id: string;
  name: string;
  grade: string;
  created_at: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { id } = event.pathParameters;

  const response = await document.query({
    TableName: "users_certificate",
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": id
    }
  }).promise();

  const userCertificate = response.Items[0] as IUserCertificate;

  if (userCertificate) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Certificado valido!",
        name: userCertificate.name,
        url: `https://certificatenodejsignitearth.s3.sa-east-1.amazonaws.com/${userCertificate.id}.pdf`
      })
    }
  }
  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Certificado invalido!"
    })
  }
}
