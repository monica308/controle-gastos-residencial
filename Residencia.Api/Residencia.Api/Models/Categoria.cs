using System.ComponentModel.DataAnnotations;

namespace Residencia.Api.Models
{
    public class Categoria
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(400)] // Conforme especificação do desafio
        public string Descricao { get; set; } = string.Empty;

        [Required]
        public string Finalidade { get; set; } = string.Empty; // "Despesa", "Receita" ou "Ambas"

        // Propriedade de navegação: Uma categoria pode estar em várias transações.
        public virtual ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
    }
}