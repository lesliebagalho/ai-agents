import { readDatabase } from "@/lib/store/database";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await readDatabase();

    const json = JSON.stringify(db, null, 2);
    const filename = `estoque-backup-${new Date().toISOString().slice(0, 10)}.json`;

    return new NextResponse(json, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao gerar backup." },
      { status: 500 },
    );
  }
}
