const fetch = require("node-fetch")

module.exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" }
  }

  // Parse the body contents into an object.
  const data = JSON.parse(event.body)
  console.log("Incoming Data: ", data)

  if (!data.passcode) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: `Missing field: passcode` }),
    }
  }

  try {
    const response = await fetch(process.env.GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query:
          "query GetPreorderPassword {\n  preorder {\n    content {\n      password\n    }\n  }\n}",
        variables: {},
      }),
      redirect: "follow",
    })

    const result = await response.text()

    const { data: responseData } = JSON.parse(result)

    console.log(responseData)

    if (responseData?.preorder?.content?.password) {
      const doesPasscodeMatch =
        data.passcode === responseData?.preorder?.content?.password

      if (doesPasscodeMatch) {
        return {
          statusCode: 200,
          body: JSON.stringify({ result: "success" }),
        }
      } else {
        return {
          statusCode: 400,
          body: JSON.stringify({
            result: "failure",
            error: { message: "Invalid Access Code. Please try again." },
          }),
        }
      }
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: {
            message: "Could not retrieve password server-side",
          },
        }),
      }
    }
  } catch (e) {
    console.log(e)

    return {
      statusCode: 500,
      body: JSON.stringify({
        result: "failure",
        error: {
          message: "Could not reach server.",
        },
      }),
    }
  }
}
