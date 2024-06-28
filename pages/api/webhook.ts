export async function handler(request: Request) {
    if (request.method == 'POST') {
    const { body } = request;
    console.log(body);
    return Response.json("cNFT burned");
    }
}
  