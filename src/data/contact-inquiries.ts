export type ContactInquiryStatus = "new" | "read"

export type ContactInquiry = {
  id: string
  name: string
  email: string
  company: string
  phone: string
  projectType: string
  timeline: string
  message: string
  status: ContactInquiryStatus
  createdAt: string
}

export type ContactInquiryInput = Pick<
  ContactInquiry,
  "name" | "email" | "company" | "phone" | "projectType" | "timeline" | "message"
>
