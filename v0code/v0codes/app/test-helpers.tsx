"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { testAddresses } from "@/mock/jar-data"

export default function TestHelpers() {
  const [selectedAddress, setSelectedAddress] = useState("")

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert(`Copied to clipboard: ${text}`)
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  return (
    <div className="fixed bottom-0 right-0 p-4 bg-black/80 text-white rounded-tl-lg z-50 max-w-md">
      <h3 className="font-bold mb-2">Test Addresses</h3>
      <div className="space-y-2 text-xs">
        <div>
          <p className="mb-1 font-medium">Addresses with jars:</p>
          {testAddresses.withJars.map((address, i) => (
            <div key={`with-${i}`} className="flex items-center gap-2 mb-1">
              <Button
                size="sm"
                variant="outline"
                className="h-6 text-xs py-0 px-2"
                onClick={() => copyToClipboard(address)}
              >
                Copy
              </Button>
              <span className="truncate">{address}</span>
            </div>
          ))}
        </div>
        <div>
          <p className="mb-1 font-medium">Addresses without jars:</p>
          {testAddresses.withoutJars.map((address, i) => (
            <div key={`without-${i}`} className="flex items-center gap-2 mb-1">
              <Button
                size="sm"
                variant="outline"
                className="h-6 text-xs py-0 px-2"
                onClick={() => copyToClipboard(address)}
              >
                Copy
              </Button>
              <span className="truncate">{address}</span>
            </div>
          ))}
        </div>
      </div>
      <Button
        variant="default"
        size="sm"
        className="mt-2 w-full"
        onClick={() => document.querySelector(".fixed.bottom-0.right-0")?.remove()}
      >
        Close
      </Button>
    </div>
  )
}

