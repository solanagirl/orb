export async function POST(request: Request) {
    const { body } = request;
    console.log(body);
    return Response.json("cNFT burned");
}
  