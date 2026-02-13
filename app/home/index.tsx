"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export function Home() {
  const router = useRouter();

  return (
    <div>Bem-vindo à Home!</div>
  );
}

export default Home;
