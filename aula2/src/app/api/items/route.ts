import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const items = await prisma.item.findMany();
    return NextResponse.json(items);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Erro ao buscar itens" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const item = await prisma.item.create({
      data: {
        nome: body.nome,
        descricao: body.descricao,
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Erro ao criar item" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    }

    await prisma.item.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Item deletado com sucesso" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Erro ao deletar item" },
      { status: 500 }
    );
  }
}
