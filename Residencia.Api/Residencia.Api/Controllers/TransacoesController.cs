using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Residencia.Api.Data;
using Residencia.Api.Models;

namespace Residencia.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransacoesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public TransacoesController(AppDbContext context) { _context = context; }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transacao>>> GetTransacoes()
            => await _context.Transacoes.Include(t => t.Categoria).Include(t => t.Pessoa).ToListAsync();

        [HttpPost]
        public async Task<ActionResult<Transacao>> PostTransacao(Transacao transacao)
        {
            _context.Transacoes.Add(transacao);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetTransacoes), new { id = transacao.Id }, transacao);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTransacao(Guid id, Transacao transacao)
        {
            if (id != transacao.Id) return BadRequest();
            _context.Entry(transacao).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransacao(Guid id)
        {
            var transacao = await _context.Transacoes.FindAsync(id);
            if (transacao == null) return NotFound();

            _context.Transacoes.Remove(transacao);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}