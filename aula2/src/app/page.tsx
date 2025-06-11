'use client';

import { useState, useEffect } from 'react';

interface Item {
  id: number;
  nome: string;
  descricao: string | null;
  createdAt: string;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [novoItem, setNovoItem] = useState({ nome: '', descricao: '' });

  const carregarItems = async () => {
    const response = await fetch('/api/items');
    const data = await response.json();
    setItems(data);
  };

  useEffect(() => {
    carregarItems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoItem),
    });
    setNovoItem({ nome: '', descricao: '' });
    carregarItems();
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/items?id=${id}`, {
      method: 'DELETE',
    });
    carregarItems();
  };

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Gerenciador de Itens</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <input
            type="text"
            placeholder="Nome do item"
            value={novoItem.nome}
            onChange={(e) => setNovoItem({ ...novoItem, nome: e.target.value })}
            className="border p-2 mr-2"
            required
          />
          <input
            type="text"
            placeholder="Descrição"
            value={novoItem.descricao}
            onChange={(e) => setNovoItem({ ...novoItem, descricao: e.target.value })}
            className="border p-2 mr-2"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Adicionar Item
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <h3 className="font-bold">{item.nome}</h3>
              {item.descricao && <p className="text-gray-600">{item.descricao}</p>}
            </div>
            <button
              onClick={() => handleDelete(item.id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Deletar
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
