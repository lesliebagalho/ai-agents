"use client";

import { useRouter } from "next/navigation";

const EXIT_TYPES = [
  { value: "ALL", label: "Todos os tipos" },
  { value: "SALE", label: "Venda" },
  { value: "INTERNAL_CONSUMPTION", label: "Consumo interno" },
  { value: "LOSS", label: "Perda" },
  { value: "BREAKAGE", label: "Quebra" },
  { value: "NEGATIVE_ADJUSTMENT", label: "Ajuste negativo" },
];

export default function ExitsFilter({ currentType }: { currentType: string }) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "ALL") {
      router.push("/exits");
    } else {
      router.push(`/exits?type=${value}`);
    }
  };

  return (
    <form className="field-row" style={{ marginBottom: 16 }}>
      <div className="field">
        <label htmlFor="type">Filtrar por tipo</label>
        <select id="type" name="type" value={currentType} onChange={handleChange}>
          {EXIT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
    </form>
  );
}
