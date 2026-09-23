import { randomUUID } from "node:crypto"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

import type { ContactInquiry, ContactInquiryInput } from "@/data/contact-inquiries"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const dataDirectory = path.join(process.cwd(), "data")
const dataFile = path.join(dataDirectory, "contact-inquiries.json")

function corsHeaders(request: Request) {
  const origin = request.headers.get("origin")
  const configuredOrigin = process.env.CONTACT_ALLOWED_ORIGIN
  const isLocalOrigin = origin?.startsWith("http://localhost:")
  const allowedOrigin = configuredOrigin
    ? origin === configuredOrigin
      ? origin
      : configuredOrigin
    : isLocalOrigin
      ? origin
      : "http://localhost:3001"

  return {
    "Access-Control-Allow-Origin": allowedOrigin ?? "http://localhost:3001",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  }
}

async function readInquiries() {
  try {
    const contents = await readFile(dataFile, "utf8")
    return JSON.parse(contents) as ContactInquiry[]
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return []
    throw error
  }
}

async function writeInquiries(inquiries: ContactInquiry[]) {
  await mkdir(dataDirectory, { recursive: true })
  await writeFile(dataFile, `${JSON.stringify(inquiries, null, 2)}\n`, "utf8")
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) })
}

export async function GET(request: Request) {
  const inquiries = await readInquiries()
  return Response.json(
    inquiries.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    { headers: corsHeaders(request) },
  )
}

export async function POST(request: Request) {
  let body: Partial<ContactInquiryInput>

  try {
    body = (await request.json()) as Partial<ContactInquiryInput>
  } catch {
    return Response.json(
      { message: "Invalid request body." },
      { status: 400, headers: corsHeaders(request) },
    )
  }

  const input: ContactInquiryInput = {
    name: text(body.name),
    email: text(body.email),
    company: text(body.company),
    phone: text(body.phone),
    projectType: text(body.projectType),
    timeline: text(body.timeline),
    message: text(body.message),
  }

  if (!input.name || !input.email || !input.projectType || !input.message) {
    return Response.json(
      { message: "Name, email, project type, and project brief are required." },
      { status: 422, headers: corsHeaders(request) },
    )
  }

  const inquiries = await readInquiries()
  const inquiry: ContactInquiry = {
    id: randomUUID(),
    ...input,
    status: "new",
    createdAt: new Date().toISOString(),
  }

  await writeInquiries([inquiry, ...inquiries])
  return Response.json(inquiry, { status: 201, headers: corsHeaders(request) })
}

export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get("id")

  if (!id) {
    return Response.json(
      { message: "Inquiry id is required." },
      { status: 400, headers: corsHeaders(request) },
    )
  }

  const inquiries = await readInquiries()
  const nextInquiries = inquiries.filter((inquiry) => inquiry.id !== id)

  if (nextInquiries.length === inquiries.length) {
    return Response.json(
      { message: "Inquiry not found." },
      { status: 404, headers: corsHeaders(request) },
    )
  }

  await writeInquiries(nextInquiries)
  return Response.json({ success: true }, { headers: corsHeaders(request) })
}
