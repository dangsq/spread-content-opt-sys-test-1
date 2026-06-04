import OptimizeDetailClient from "./client";

export function generateStaticParams() {
  return [{ id: "placeholder" }];
}

export default function OptimizeDetailPage() {
  return <OptimizeDetailClient />;
}