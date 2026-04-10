using System.ComponentModel.DataAnnotations;

namespace Residencia.Api.Models
{
    public class Pessoa
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(200)] // Conforme especificação do desafio
        public string Nome { get; set; } = string.Empty;

        [Required]
        public int Idade { get; set; }

        // Propriedade de navegação: Uma pessoa pode ter várias transações.
        // Isso ajuda o Entity Framework a configurar o Cascade Delete.
        public virtual ICollection<Transacao> Transacoes { get; set; } = new List<Transacao>();
    }
}