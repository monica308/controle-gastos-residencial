"use client"

import { useEffect, useState } from "react"

import api from "./services/api"

interface Pessoa {
  id: string
  nome: string
  idade: number
}

export default function Home() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [nome, setNome] = useState("")
  const [idade, setIdade] = useState("")
  const [idEdicao, setIdEdicao] = useState<string | null>(null)

  // Busca lista de membros atualizada para o dashboard
  const fetchData = async () => {
    try {
      const res = await api.get("/Pessoas")
      setPessoas(res.data)
    } catch {
      console.error("Erro ao carregar membros")
    }
  }

  // Carregamento inicial dos dados da residência
  useEffect(() => {
    const load = async () => {
      await fetchData()
    }
    load()
  }, [])

  // Alimenta o formulário com dados do membro para alteração
  const prepararEdicao = (pessoa: Pessoa) => {
    setIdEdicao(pessoa.id)
    setNome(pessoa.nome)
    setIdade(pessoa.idade.toString())
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Persiste novo membro ou atualiza existente via PUT/POST
  const handleAddPessoa = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const payload = {
        id: idEdicao || undefined,
        nome,
        idade: parseInt(idade)
      }

      if (idEdicao) {
        await api.put(`/Pessoas/${idEdicao}`, payload)
      } else {
        await api.post("/Pessoas", payload)
      }

      setNome("")
      setIdade("")
      setIdEdicao(null)
      fetchData()
    } catch {
      alert("Erro ao salvar informações")
    }
  }

  // Remove integrante e dispara exclusão de transações vinculadas no banco
  const handleDeletePessoa = async (id: string) => {
    if (confirm("Deseja realmente remover este integrante? Todas as transações dele também serão apagadas.")) {
      try {
        await api.delete(`/Pessoas/${id}`)
        fetchData()
      } catch {
        alert("Erro ao excluir integrante")
      }
    }
  }

  return (
    <main className="p-6 md:p-10 bg-slate-100 min-h-screen">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10">
        
        <section className="bg-white p-8 rounded-2xl shadow-xl border-2 border-blue-500">
          <h2 className="text-2xl font-black mb-6 text-slate-900 uppercase">
            {idEdicao ? "📝 Editar Membro" : "👤 Novo Membro"}
          </h2>
          <form onSubmit={handleAddPessoa} className="space-y-6">
            <input 
              type="text" 
              className="w-full p-4 border-2 border-slate-300 rounded-xl text-slate-950 font-medium focus:border-blue-600 outline-none"
              value={nome} 
              onChange={e => setNome(e.target.value)} 
              placeholder="Nome"
              required 
            />
            <input 
              type="number" 
              className="w-full p-4 border-2 border-slate-300 rounded-xl text-slate-950 font-medium focus:border-blue-600 outline-none"
              value={idade} 
              onChange={e => setIdade(e.target.value)} 
              placeholder="Idade"
              required 
            />
            <div className="flex gap-2">
              <button className="flex-1 bg-blue-700 text-white p-4 rounded-xl font-black uppercase hover:bg-blue-800 transition-all active:scale-95">
                {idEdicao ? "Salvar Alterações" : "Adicionar ao Grupo"}
              </button>
              {idEdicao && (
                <button 
                  type="button"
                  onClick={() => { setIdEdicao(null); setNome(""); setIdade("") }}
                  className="bg-slate-200 text-slate-700 p-4 rounded-xl font-black uppercase"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
          <h2 className="text-2xl font-black mb-6 text-slate-900 uppercase">Integrantes</h2>
          <ul className="space-y-4">
            {pessoas.map(p => (
              <li key={p.id} className="p-5 bg-slate-50 rounded-xl border-2 border-slate-200 flex justify-between items-center hover:bg-white transition-all shadow-sm">
                <div>
                  <p className="font-black text-xl text-slate-950 uppercase tracking-tighter">{p.nome}</p>
                  <p className="text-xs font-bold text-slate-500 uppercase">{p.idade} anos</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => prepararEdicao(p)}
                    className="bg-blue-50 text-blue-600 p-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDeletePessoa(p.id)}
                    className="bg-red-50 text-red-600 p-3 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}