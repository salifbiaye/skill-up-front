import {NextRequest, NextResponse} from "next/server";

export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  const param = await params
  const path = param.path.join('/');
  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/${path}`; // Remplacez par votre URL
  const body = await req.text()
  console.log("body",body)
  try {
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Backend error:', error);
    return NextResponse.json(
        { error: 'Le serveur backend n\'est pas disponible' },
        { status: 502 }
    );
  }
}