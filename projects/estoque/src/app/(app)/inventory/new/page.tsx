import { saveInventoryMovementAction } from "@/features/products/actions";
import { canRegisterMovements, requireSessionContext } from "@/lib/auth/auth";
import { listProductsWithBalance } from "@/lib/store/database";

type NewMovementPageProps = {
  searchParams?: Promise<{
    error?: string;
    success?: string;
  }>;
};

export default async function NewMovementPage({ searchParams }: NewMovementPageProps) {
  const session = await requireSessionContext();
  const params = await searchParams;
  const products = await listProductsWithBalance(session.activeCompany.id);
  const canWrite = canRegisterMovements(session.activeRole);

  return (
    <div className="stack-lg">
      <section className="surface-card section-card">
        <div className="section-header">
          <h2>Nova movimentacao</h2>
        </div>

        {params?.error ? <div className="message error" style={{ marginBottom: 16 }}>{params.error}</div> : null}
        {params?.success ? <div className="message success" style={{ marginBottom: 16 }}>{params.success}</div> : null}

        {!canWrite ? (
          <div className="message error">Seu perfil nao pode registrar movimentacoes nesta empresa.</div>
        ) : (
          <form action={saveInventoryMovementAction} className="field-grid">
            <div className="field-row three">
              <div className="field">
                <label htmlFor="type">Tipo *</label>
                <select id="type" name="type" defaultValue="ENTRY">
                  <option value="ENTRY">Entrada</option>
                  <option value="EXIT">Saida</option>
                  <option value="ADJUSTMENT">Ajuste</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="productId">Produto *</label>
                <select id="productId" name="productId" required defaultValue="">
                  <option value="" disabled>
                    Selecione
                  </option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} | saldo atual: {product.currentQuantity}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="quantity">Quantidade *</label>
                <input id="quantity" name="quantity" type="number" min="0" step="0.01" required />
              </div>
            </div>

            <div className="field-row two">
              <div className="field">
                <label htmlFor="reason">Motivo</label>
                <input id="reason" name="reason" placeholder="Obrigatorio para ajuste" />
              </div>

              <div className="field">
                <label htmlFor="referenceCode">Referencia</label>
                <input id="referenceCode" name="referenceCode" placeholder="NF, pedido ou codigo interno" />
              </div>
            </div>

            <div className="field">
              <label htmlFor="note">Observacao</label>
              <textarea id="note" name="note" placeholder="Detalhes da movimentacao" />
            </div>

            <button type="submit" className="button primary">
              Registrar movimentacao
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
