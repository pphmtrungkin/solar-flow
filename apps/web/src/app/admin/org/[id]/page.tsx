"use client";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default async function Page() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  useEffect(() => {}, [id]);
}
