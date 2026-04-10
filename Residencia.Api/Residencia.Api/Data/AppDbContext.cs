using Microsoft.EntityFrameworkCore;
using Residencia.Api.Models;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace Residencia.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) 
        {
            // Força o SQLite a respeitar as regras de Foreign Key e Cascade
            Database.OpenConnection();
            using var command = Database.GetDbConnection().CreateCommand();
            command.CommandText = "PRAGMA foreign_keys = ON";
            command.ExecuteNonQuery();
        }

        public DbSet<Pessoa> Pessoas { get; set; }
        public DbSet<Transacao> Transacoes { get; set; }
        public DbSet<Categoria> Categorias { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configura a deleção em cascata: se apagar a Pessoa, apaga as Transações dela
            modelBuilder.Entity<Transacao>()
                .HasOne(t => t.Pessoa)
                .WithMany(p => p.Transacoes)
                .HasForeignKey(t => t.PessoaId)
                .OnDelete(DeleteBehavior.Cascade);

            base.OnModelCreating(modelBuilder);
        }
    }
}