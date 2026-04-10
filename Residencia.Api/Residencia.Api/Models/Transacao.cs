using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Residencia.Api.Models
{
    public class Transacao
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(400)]
        public string Descricao { get; set; } = string.Empty;

        [Required]
        [Column(TypeName = "decimal(18,2)")] // Define precisão para dinheiro
        [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser positivo")]
        public decimal Valor { get; set; }

        [Required]
        public string Tipo { get; set; } = string.Empty; // "Despesa" ou "Receita"

        // Relacionamento com Categoria
        [Required]
        public Guid CategoriaId { get; set; }
        public virtual Categoria? Categoria { get; set; }

        // Relacionamento com Pessoa
        [Required]
        public Guid PessoaId { get; set; }
        public virtual Pessoa? Pessoa { get; set; }
    }
}