"use client";

import { closeInventoryCountAction } from "@/features/products/actions";

export default function CloseInventoryButton({ countId, isOpen, canEdit }: { countId: string; isOpen: boolean; canEdit: boolean }) {
  if (!isOpen || !canEdit) return null;

  return (
    <form action={closeInventoryCountAction} style={{ marginTop: 12 }}>
      <input type="hidden" name="countId" value={countId} />
      <button
        type="submit"
        className="button primary"
        onClick={(e) => {
          if (!confirm("Fechar inventario? Ajustes serao aplicados automaticamente no estoque.")) {
            e.preventDefault();
          }
        }}
      >
        Fechar inventario e aplicar ajustes
      </button>
    </form>
  );
}
