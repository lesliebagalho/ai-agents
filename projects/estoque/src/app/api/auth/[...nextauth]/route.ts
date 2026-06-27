import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "A autenticacao deste projeto esta implementada via credenciais e cookie de sessao.",
  });
}

export async function POST() {
  return NextResponse.json(
    {
      message: "Use o formulario de login da aplicacao para iniciar a sessao.",
    },
    { status: 405 },
  );
}
