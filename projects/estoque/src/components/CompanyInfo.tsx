"use client";

type CompanyInfoProps = {
  name: string;
  role: string;
};

export default function CompanyInfo({ name, role }: CompanyInfoProps) {
  return (
    <div className="sidebar-company">
      <div className="sidebar-company-name">{name}</div>
      <div className="sidebar-company-role">{role}</div>
    </div>
  );
}
