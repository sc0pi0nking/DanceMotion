import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import TeamGrid, { type TeamMember } from "./TeamGrid";

export const metadata: Metadata = {
  title: "Unser Team",
  description:
    "Lerne die Menschen hinter DanceMotion Eschweiler kennen – Leidenschaft, Energie und Professionalität.",
  alternates: { canonical: "/team" },
};

async function getTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("published", true)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Failed to load team members:", error);
    return [];
  }
  return (data as TeamMember[]) || [];
}

export default async function TeamPage() {
  const members = await getTeamMembers();
  return <TeamGrid members={members} />;
}
