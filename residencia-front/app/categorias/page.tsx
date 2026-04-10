"use client"

import { useEffect, useState } from "react"

import api from "../services/api"

interface Categoria {
  id: string
  descricao: string
  finalidade: string
}

export default function Categorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [descricao, setDescricao] = useState("")
  const [finalidade, setFinalidade] = useState("")
  const [idEdicao, setIdEdicao] = useState<string | null>(null)

  // Sincroniza lista de categorias com o banco de dados
  const fetchCategorias = async () => {
    try {
      const response = await api.get("/Categorias")
      setCategorias(response.data)
    } catch {
      console.error("Erro ao buscar categorias no banco")
    }
  }

  useEffect(() => {
    const init = async () => {
      await fetchCategorias()
    }
    init()
  }, [])

  // Preenche formulário para edição de descrição ou finalidade
  const prepararEdicao = (cat: Categoria) => {
    setIdEdicao(cat.id)
    setDescricao(cat.descricao)
    setFinalidade(cat.finalidade)
  }

  // Salva nova categoria ou edita existente respeitando os limites de caracteres
  const handleAddCategoria = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (idEdicao) {
        await api.put(`/Categorias/${idEdicao}`, {
          id: idEdicao,
          descricao,
          finalidade
        })
      } else {
        await api.post("/Categorias", { descricao, finalidade })
      }
      setDescricao("")
      setFinalidade("")
      setIdEdicao(null)
      fetchCategorias()
    } catch {
      console.error("Erro ao salvar categoria via API")
    }
  }

  // Remove categoria caso não haja transações impeditivas vinculadas
  const handleDeleteCategoria = async (id: string) => {
    if (confirm("Deseja realmente excluir esta categoria?")) {
      try {
        await api.delete(`/Categorias/${id}`)
        fetchCategorias()
      } catch {
        alert("Erro: Verifique se existem transações vinculadas.")
      }
    }
  }

  return (
    <main className="p-6 md:p-10 bg-slate-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black text-slate-950 mb-10 text-center uppercase tracking-tighter">
          🏷️ Gestão de Categorias
        </h1>

        <div className="grid md:grid-cols-2 gap-10">
          <section className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
            <h2 className="text-2xl font-black mb-6 text-slate-900 border-l-4 border-green-600 pl-4 uppercase">
              {idEdicao ? "Editar Categoria" : "Nova Categoria"}
            </h2>
            <form onSubmit={handleAddCategoria} className="space-y-6">
              <input
                type="text"
                placeholder="Ex: Alimentação, Lazer..."
                className="w-full p-4 border-2 border-slate-300 rounded-xl text-slate-950 font-medium focus:border-green-600 outline-none"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Ex: despesa, receita ou ambas"
                className="w-full p-4 border-2 border-slate-300 rounded-xl text-slate-950 font-medium focus:border-green-600 outline-none"
                value={finalidade}
                onChange={(e) => setFinalidade(e.target.value)}
                required
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-green-700 text-white p-4 rounded-xl font-black text-lg hover:bg-green-800 transition shadow-lg">
                  {idEdicao ? "SALVAR ALTERAÇÕES" : "SALVAR CATEGORIA"}
                </button>
                {idEdicao && (
                  <button type="button" onClick={() => { setIdEdicao(null); setDescricao(""); setFinalidade("") }} className="bg-slate-200 text-slate-700 p-4 rounded-xl font-black uppercase">
                    CANCELAR
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
            <h2 className="text-2xl font-black mb-6 text-slate-900 border-l-4 border-slate-400 pl-4 uppercase">
              Categorias Ativas
            </h2>
            <ul className="space-y-4">
              {categorias.length === 0 ? (
                <p className="text-slate-500 font-bold text-center py-10 uppercase text-xs">Nenhuma categoria cadastrada.</p>
              ) : (
                categorias.map((cat) => (
                  <li key={cat.id} className="p-5 bg-slate-50 rounded-xl border-2 border-slate-200 flex justify-between items-center hover:bg-white transition shadow-sm">
                    <div className="flex flex-col">
                      <span className="font-black text-xl text-slate-950 uppercase">{cat.descricao}</span>
                      <span className="text-xs font-black text-slate-500 uppercase mt-1">Tipo: {cat.finalidade}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => prepararEdicao(cat)} className="bg-blue-50 text-blue-600 p-3 rounded-xl hover:bg-blue-600 hover:text-white transition shadow-sm">
                        ✏️
                      </button>
                      <button onClick={() => handleDeleteCategoria(cat.id)} className="bg-red-50 text-red-600 p-3 rounded-xl hover:bg-red-600 hover:text-white transition shadow-sm">
                        🗑️
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>
      </div>
    </main>
  )
}