// scripts/cleanup-affiliate-programs.ts
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🔍 Checking for duplicate affiliate programs...")
  
  const programs = await prisma.affiliateProgram.findMany()
  
  console.log(`Found ${programs.length} programs`)
  
  programs.forEach((p) => {
    console.log(`- ${p.name} (${p.slug}) - ID: ${p.id}`)
  })
  
  // Delete duplicates if needed
  // Uncomment to delete specific programs:
  // await prisma.affiliateProgram.delete({
  //   where: { id: "cmtfevd940004owuy0yi8g61u" }
  // })
  // console.log("Deleted program with ID: cmtfevd940004owuy0yi8g61u")
  
  // Or delete all programs (careful!)
  // await prisma.affiliateProgram.deleteMany({})
  // console.log("Deleted all affiliate programs")
  
  console.log("✅ Done!")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
