"use client"

import { useEffect, useState } from "react"

import api from "../services/api"

interface Pessoa {
  id: string
  nome: string
  idade: number 
}

interface Categoria {
  id: string
  descricao: string
}

interface Transacao {
  id: string
  descricao: string
  valor: number
  tipo: string
  pessoaId: string
  categoriaId: string
  pessoa?: { nome: string }
  categoria?: { descricao: string }
}

export default function Transacoes() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])

  const [descricao, setDescricao] = useState("")
  const [valor, setValor] = useState("")
  const [tipo, setTipo] = useState("Saída")
  const [pessoaId, setPessoaId] = useState("")
  const [categoriaId, setCategoriaId] = useState("")
  const [idEdicao, setIdEdicao] = useState<string | null>(null)

  // Carrega dados necessários para os selects e para a listagem
  const carregarDados = async () => {
    try {
      const [resP, resC, resT] = await Promise.all([
        api.get("/Pessoas"),
        api.get("/Categorias"),
        api.get("/Transacoes")
      ])
      setPessoas(resP.data)
      setCategorias(resC.data)
      setTransacoes(resT.data)
    } catch {
      console.error("Erro ao carregar dados")
    }
  }

  useEffect(() => {
    const load = async () => {
      await carregarDados()
    }
    load()
  }, [])

  // Prepara o formulário para correção de lançamentos
  const prepararEdicao = (t: Transacao) => {
    setIdEdicao(t.id)
    setDescricao(t.descricao)
    setValor(t.valor.toString())
    setTipo(t.tipo)
    setPessoaId(t.pessoaId)
    setCategoriaId(t.categoriaId)
  }

  // Valida e envia a transação respeitando as regras de idade e valor positivo
  const handleAddTransacao = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const pessoa = pessoas.find(p => p.id === pessoaId)
    
    // Regra: Menores de 18 anos não podem registrar Entradas
    if (pessoa && pessoa.idade < 18 && tipo === "Entrada") {
      alert("Menores de 18 anos só podem registrar despesas (Saída)")
      return
    }

    // Regra: Impede valores negativos ou zerados
    if (parseFloat(valor) <= 0) {
      alert("O valor deve ser maior que zero")
      return
    }

    try {
      const dados = { id: idEdicao || undefined, descricao, valor: parseFloat(valor), tipo, pessoaId, categoriaId }
      
      if (idEdicao) {
        await api.put(`/Transacoes/${idEdicao}`, dados)
      } else {
        await api.post("/Transacoes", dados)
      }

      setDescricao("")
      setValor("")
      setPessoaId("")
      setCategoriaId("")
      setIdEdicao(null)
      carregarDados()
    } catch {
      alert("Erro ao salvar transação no banco de dados")
    }
  }

  // Deleta o lançamento financeiro permanentemente
  const handleDeleteTransacao = async (id: string) => {
    if (confirm("Confirmar a exclusão definitiva?")) {
      try {
        await api.delete(`/Transacoes/${id}`)
        carregarDados()
      } catch {
        console.error("Falha ao remover transação")
      }
    }
  }

  return (
    <main className="p-6 md:p-10 bg-slate-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tighter">💸 Gestão de Lançamentos</h1>

        <form onSubmit={handleAddTransacao} className="bg-white p-6 rounded-2xl shadow-xl border-2 border-slate-200 grid gap-4 mb-10">
          <input
            type="text"
            className="p-4 border-2 border-slate-300 rounded-xl text-slate-950 font-medium outline-none focus:border-blue-600"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descrição"
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              step="0.01"
              className="p-4 border-2 border-slate-300 rounded-xl text-slate-950 font-medium outline-none"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="Valor R$"
              required
            />
            <select className="p-4 border-2 border-slate-300 rounded-xl text-slate-950 font-bold" value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="Saída">🔴 Saída</option>
              <option value="Entrada">🟢 Entrada</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <select className="p-4 border-2 border-slate-300 rounded-xl text-slate-950 font-bold" value={pessoaId} onChange={(e) => setPessoaId(e.target.value)} required>
              <option value="">👤 Pessoa</option>
              {pessoas.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
            <select className="p-4 border-2 border-slate-300 rounded-xl text-slate-950 font-bold" value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} required>
              <option value="">🏷️ Categoria</option>
              {categorias.map((c) => <option key={c.id} value={c.id}>{c.descricao}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="flex-1 bg-blue-700 text-white p-4 rounded-xl font-black uppercase hover:bg-blue-800 transition">
              {idEdicao ? "Salvar Alteração" : "Confirmar Lançamento"}
            </button>
            {idEdicao && (
              <button type="button" onClick={() => { setIdEdicao(null); setDescricao(""); setValor(""); setPessoaId(""); setCategoriaId("") }} className="bg-slate-200 p-4 rounded-xl font-black">CANCELAR</button>
            )}
          </div>
        </form>

        <section className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
          <h2 className="text-2xl font-black mb-6 text-slate-900 border-l-4 border-red-600 pl-4 uppercase">Últimos Históricos</h2>
          <div className="space-y-4">
            {transacoes.length === 0 ? (
              <p className="text-slate-500 italic text-center py-4">Nenhuma transação encontrada.</p>
            ) : (
              transacoes.map((t) => (
                <div key={t.id} className="p-5 bg-slate-50 rounded-2xl border-2 border-slate-200 flex justify-between items-center shadow-sm">
                  <div>
                    <span className="font-black text-slate-950 text-xl uppercase">{t.descricao}</span>
                    <p className="text-xs font-black text-slate-500 uppercase">👤 {t.pessoa?.nome} • 🏷️ {t.categoria?.descricao}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-2xl font-black ${t.tipo === "Entrada" ? "text-green-700" : "text-red-700"}`}>
                      R$ {t.valor.toFixed(2)}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => prepararEdicao(t)} className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition">✏️</button>
                      <button onClick={() => handleDeleteTransacao(t.id)} className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-600 hover:text-white transition">🗑️</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  )
}