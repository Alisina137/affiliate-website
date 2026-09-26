import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { z } from "zod"

const createProjectSchema=z.object({
  name:z.string().trim().min(2).max(120),
  domain:z.string().trim().max(255).optional().or(z.literal("")),
  description:z.string().trim().max(1000).optional().or(z.literal("")),
})

export async function GET() {
  const session=await auth()
  if(!session?.user?.id) return NextResponse.json({error:"Unauthorized"},{status:401})
  const projects=await db.optimizerProject.findMany({where:{userId:session.user.id},orderBy:{updatedAt:"desc"},include:{_count:{select:{articles:true}}}})
  return NextResponse.json({projects})
}

export async function POST(request:Request) {
  const session=await auth()
  if(!session?.user?.id) return NextResponse.json({error:"Unauthorized"},{status:401})
  const parsed=createProjectSchema.safeParse(await request.json())
  if(!parsed.success) return NextResponse.json({error:"Invalid project data",details:parsed.error.flatten()},{status:400})
  const project=await db.optimizerProject.create({data:{userId:session.user.id,name:parsed.data.name,domain:parsed.data.domain||null,description:parsed.data.description||null}})
  await db.optimizerUsage.create({data:{userId:session.user.id,action:"PROJECT_CREATED",metadata:{projectId:project.id}}})
  return NextResponse.json({project},{status:201})
}
