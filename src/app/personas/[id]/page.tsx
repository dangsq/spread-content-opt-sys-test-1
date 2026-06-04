import PersonaDetailClient from "./client";

export function generateStaticParams() {
  return [{ id: "placeholder" }];
}

export default function PersonaDetailPage() {
  return <PersonaDetailClient />;
}