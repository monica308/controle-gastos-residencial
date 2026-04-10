"use client"

import { useEffect, useState } from "react"

import api from "../services/api"

interface Pessoa {
  id: string
  nome: string
}

interface Transacao {
  valor: number
  tipo: string
  pessoaId: string
}

export default function Relatorios() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [transacoes, setTransacoes] = useState<Transacao[]>([])

  // Busca massa de dados completa para processamento do relatório
  const carregarDados = async () => {
    try {
      const [resP, resT] = await Promise.all([
        api.get("/Pessoas"),
        api.get("/Transacoes")
      ])
      setPessoas(resP.data)
      setTransacoes(resT.data)
    } catch {
      console.error("Erro ao gerar relatório consolidado")
    }
  }

  useEffect(() => {
    const load = async () => {
      await carregarDados()
    }
    load()
  }, [])

  // Processa receitas, despesas e saldo líquido por integrante
  const relatorio = pessoas.map(pessoa => {
    const transacoesPessoa = transacoes.filter(t => t.pessoaId === pessoa.id)
    const receitas = transacoesPessoa.filter(t => t.tipo === 'Entrada').reduce((acc, t) => acc + t.valor, 0)
    const despesas = transacoesPessoa.filter(t => t.tipo === 'Saída').reduce((acc, t) => acc + t.valor, 0)
    return { nome: pessoa.nome, receitas, despesas, saldo: receitas - despesas }
  })

  // Cálculos consolidados para o total geral da residência
  const totalGeralReceitas = relatorio.reduce((acc, p) => acc + p.receitas, 0)
  const totalGeralDespesas = relatorio.reduce((acc, p) => acc + p.despesas, 0)

  return (
    <main className="p-6 md:p-10 bg-slate-100 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 mb-8 uppercase text-center tracking-tighter">📊 Relatório de Totais por Pessoa</h1>
        
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-950 text-white uppercase text-xs">
              <tr>
                <th className="p-6">Integrante</th>
                <th className="p-6">Ganhos (+)</th>
                <th className="p-6">Gastos (-)</th>
                <th className="p-6">Saldo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {relatorio.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors">
                  <td className="p-6 font-black text-slate-900 uppercase">{item.nome}</td>
                  <td className="p-6 font-bold text-green-700">R$ {item.receitas.toFixed(2)}</td>
                  <td className="p-6 font-bold text-red-700">R$ {item.despesas.toFixed(2)}</td>
                  <td className={`p-6 font-black ${item.saldo >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                    R$ {item.saldo.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Linha de totais finais para visão macro financeira */}
            <tfoot className="bg-slate-900 font-black text-white">
              <tr>
                <td className="p-6 uppercase">Total Geral</td>
                <td className="p-6 text-green-400">R$ {totalGeralReceitas.toFixed(2)}</td>
                <td className="p-6 text-red-400">R$ {totalGeralDespesas.toFixed(2)}</td>
                <td className="p-6 text-xl">R$ {(totalGeralReceitas - totalGeralDespesas).toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </main>
  )
}