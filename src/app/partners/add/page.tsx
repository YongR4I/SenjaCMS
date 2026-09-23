import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

import { PartnerForm } from "@/components/partner-form"
import { Button } from "@/components/ui/button"

export default function AddPartnerPage() {
  return (
    <div className="cms-page">
      <div className="page-header items-start!">
        <div className="flex items-start gap-4">
          <Button
            variant="outline"
            size="icon"
            aria-label="Back to Partners"
            render={<Link href="/partners" />}
          >
            <ArrowLeftIcon />
          </Button>
          <div>
            <p className="page-eyebrow">Partners · New entry</p>
            <h1 className="page-title">Add Partner</h1>
            <p className="page-description">
              Add a technology partner using the content structure required by the Senja frontend.
            </p>
          </div>
        </div>
      </div>

      <PartnerForm />
    </div>
  )
}
