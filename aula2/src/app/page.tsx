'use client';
import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ItemManagerABI, ITEM_MANAGER_ADDRESS } from '../lib/contracts';

export default function Home() {

  const { isConnected } = useAccount();
  const [novoItem, setNovoItem] = useState({ nome: '', descricao: '' });

  const { writeContract, data: hash, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ hash });

  const { data: nextItemId, refetch } = useReadContract({
    address: ITEM_MANAGER_ADDRESS,
    abi: ItemManagerABI,
    functionName: 'nextItemId',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoItem.nome) return;

    writeContract({
      address: ITEM_MANAGER_ADDRESS,
      abi: ItemManagerABI,
      functionName: 'criarItem',
      args: [novoItem.nome, novoItem.descricao],
    });

    setNovoItem({ nome: '', descricao: '' });
  };

  if (isConfirmed) {
    refetch();
  }

  if (!isConnected) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-8">Conecte sua Carteira</h1>
        <p className="text-gray-600 mb-8">Para acessar o Gerenciador de Itens Web3</p>
        <ConnectButton />
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gerenciador de Itens Web3</h1>
        <ConnectButton />
      </div>

      {hash && (
        <div className="mb-4 p-4">
          {isConfirming && <p>⏳ Aguardando confirmação...</p>}
          {isConfirmed && <p>✅ Transação confirmada!</p>}
          <p className="text-sm">Hash: {hash.slice(0, 10)}...{hash.slice(-8)}</p>
        </div>
      )}

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
          <button 
            type="submit" 
            disabled={isPending}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
          >
            {isPending ? 'Criando...' : 'Adicionar Item'}
          </button>
        </div>
      </form>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Total de Items: {nextItemId ? Number(nextItemId) - 1 : 0}</h2>
        
        <p className="text-gray-600">
          Items criados no contrato: {ITEM_MANAGER_ADDRESS.slice(0, 6)}...{ITEM_MANAGER_ADDRESS.slice(-4)}
        </p>
      </div>
    </main>
  );
}