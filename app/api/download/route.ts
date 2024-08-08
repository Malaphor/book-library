import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const params = req.nextUrl.searchParams;

    const fileUrl = params.get("fileUrl");
    const title = params.get("title");

    if (!fileUrl || !title)
      return new NextResponse(
        JSON.stringify({ message: "Invalid query parameters." })
      );

    const fileName = `${title}${fileUrl.substring(fileUrl.lastIndexOf("."))}`;

    const response = await fetch(fileUrl);

    return new NextResponse(response.body, {
      headers: {
        ...response.headers,
        "content-disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ message: "Error getting books.", error })
    );
  }
};
