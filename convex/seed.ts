// Seed script for Drakonomi dragons
// Run in Convex Dashboard or with: npx convex run dragons:reseedDragons

import { api } from "./_generated/api";

export default async function seedDatabase() {
  console.log("🐉 Seeding Drakonomi database...");
  
  // This will be run via Convex CLI
  console.log("Run in terminal:");
  console.log("npx convex run dragons:reseedDragons");
  
  return { 
    message: "Use: npx convex run dragons:reseedDragons" 
  };
}
