"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  Network,
  Coins,
  Trash,
  Upload,
  ChevronDown,
  ChevronUp,
  Download,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getJarById, formatDate, truncateText, type CookieJar } from "@/mock/jar-data"

// Collapsible section component
const CollapsibleSection = ({
  title,
  children,
  defaultExpanded = false,
}: {
  title: string
  children: React.ReactNode
  defaultExpanded?: boolean
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-4 bg-muted/30 text-left"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-medium">{title}</h3>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>
      {isExpanded && <div className="p-4 border-t">{children}</div>}
    </div>
  )
}

export default function ManageJarPage() {
  const { id } = useParams<{ id: string }>()
  const [jar, setJar] = useState<CookieJar | null>(null)
  const [loading, setLoading] = useState(true)
  const [maxWithdrawal, setMaxWithdrawal] = useState("")
  const [cooldownValue, setCooldownValue] = useState("")
  const [cooldownUnit, setCooldownUnit] = useState("hours")
  const [whitelistedAddresses, setWhitelistedAddresses] = useState("")
  const [donateAmount, setDonateAmount] = useState("")
  const [donateToCookieJarProject, setDonateToCookieJarProject] = useState(true)
  const [donationPercentage, setDonationPercentage] = useState(5)
  const [copied, setCopied] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Simulate loading the jar data
    setLoading(true)
    setTimeout(() => {
      const foundJar = getJarById(id as string)
      if (foundJar) {
        setJar(foundJar)
        setMaxWithdrawal(foundJar.maxWithdrawal)

        // Parse cooldown period
        if (foundJar.cooldownPeriod.includes("hour")) {
          setCooldownValue(foundJar.cooldownPeriod.split(" ")[0])
          setCooldownUnit("hours")
        } else if (foundJar.cooldownPeriod.includes("day")) {
          setCooldownValue(foundJar.cooldownPeriod.split(" ")[0])
          setCooldownUnit("days")
        } else if (foundJar.cooldownPeriod.includes("minute")) {
          setCooldownValue(foundJar.cooldownPeriod.split(" ")[0])
          setCooldownUnit("minutes")
        } else if (foundJar.cooldownPeriod.includes("month")) {
          setCooldownValue(foundJar.cooldownPeriod.split(" ")[0])
          setCooldownUnit("months")
        }

        // For demo purposes, generate some whitelisted addresses
        const demoWhitelistedAddresses = [
          "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
          "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
          "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
        ]
        setWhitelistedAddresses(demoWhitelistedAddresses.join("\n"))
      }
      setLoading(false)
    }, 1000)
  }, [id])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatAddress = (address: string) => {
    if (!address || address.length < 10) return address
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const isValidEVMAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  }

  const handleExportCSV = () => {
    const addresses = whitelistedAddresses
      .split(/[\s,]+/)
      .map((addr) => addr.trim())
      .filter((addr) => addr.length > 0)

    const csvContent = addresses.join(",")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${jar.title.replace(/\s+/g, "-")}-whitelist.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (content) {
        const addresses = content
          .split(/[\r\n,]+/)
          .map((addr) => addr.trim())
          .filter((addr) => addr.length > 0 && isValidEVMAddress(addr))

        if (addresses.length > 0) {
          setWhitelistedAddresses((prev) => {
            const currentAddresses = prev.split("\n").filter((addr) => addr.trim())
            const uniqueAddresses = [...new Set([...currentAddresses, ...addresses])]
            return uniqueAddresses.join("\n")
          })
        }
      }
    }
    reader.readAsText(file)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSaveChanges = () => {
    // Validate inputs
    const newErrors: Record<string, string> = {}

    if (!maxWithdrawal) {
      newErrors.maxWithdrawal = "Maximum withdrawal amount is required"
    } else if (isNaN(Number(maxWithdrawal)) || Number(maxWithdrawal) <= 0) {
      newErrors.maxWithdrawal = "Please enter a valid withdrawal amount"
    }

    if (!cooldownValue) {
      newErrors.cooldown = "Cooldown period is required"
    } else if (isNaN(Number(cooldownValue)) || Number(cooldownValue) <= 0) {
      newErrors.cooldown = "Please enter a valid cooldown period"
    }

    // Format addresses in the background
    const formattedAddresses = whitelistedAddresses
      .split(/[\s,]+/)
      .map((addr) => addr.trim())
      .filter((addr) => addr.length > 0)
      .filter((addr) => isValidEVMAddress(addr))

    // Update the whitelist with unique valid addresses
    setWhitelistedAddresses([...new Set(formattedAddresses)].join("\n"))

    // Validate each whitelist address
    const addresses = whitelistedAddresses.split("\n").filter((addr) => addr.trim())
    if (addresses.some((addr) => !isValidEVMAddress(addr))) {
      newErrors.whitelistedAddresses = "One or more addresses are invalid"
    }

    // Validate donation amount if provided
    if (donateAmount && (isNaN(Number(donateAmount)) || Number(donateAmount) <= 0)) {
      newErrors.donateAmount = "Please enter a valid donation amount"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setLoading(true)

    // Simulate saving changes
    setTimeout(() => {
      setLoading(false)
      setSaveSuccess(true)

      // Update jar data
      if (jar) {
        let updatedBalance = Number.parseFloat(jar.balance)

        // Add funds if donation amount is provided
        if (donateAmount && !isNaN(Number(donateAmount))) {
          updatedBalance += Number.parseFloat(donateAmount)
        }

        const updatedJar = {
          ...jar,
          maxWithdrawal,
          cooldownPeriod: `${cooldownValue} ${cooldownUnit}`,
          balance: updatedBalance.toFixed(2),
        }
        setJar(updatedJar)

        // Reset donation amount after saving
        setDonateAmount("")
      }

      setTimeout(() => setSaveSuccess(false), 3000)
    }, 1500)
  }

  const handleRemoveAllFunds = () => {
    if (!jar) return

    if (!confirm(`Are you sure you want to remove all funds (${jar.balance} ${jar.tokenType}) from this jar?`)) {
      return
    }

    setLoading(true)

    // Simulate removing funds
    setTimeout(() => {
      setLoading(false)

      // Update jar data
      if (jar) {
        const updatedJar = {
          ...jar,
          balance: "0.00",
        }
        setJar(updatedJar)
      }

      alert(`All funds have been removed from the jar.`)
    }, 1500)
  }

  const calculateTotalAmount = () => {
    if (!donateAmount || isNaN(Number(donateAmount))) return "0"

    const fundingAmount = Number(donateAmount)
    if (donateToCookieJarProject && donationPercentage > 0) {
      const donationAmount = fundingAmount * (donationPercentage / 100)
      return (fundingAmount + donationAmount).toFixed(2)
    }

    return fundingAmount.toFixed(2)
  }

  if (loading && !jar) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/manage-jars" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to manage jars</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Manage Cookie Jar</h1>
        </div>
        <div className="flex justify-center items-center py-20">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="ml-2">Loading jar details...</p>
        </div>
      </div>
    )
  }

  if (!jar) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/manage-jars" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to manage jars</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Manage Cookie Jar</h1>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Cookie Jar Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The cookie jar you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/manage-jars">
              <Button>Back to Manage Jars</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/manage-jars" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to manage jars</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Manage Cookie Jar</h1>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="ml-2">Processing changes...</p>
          </div>
        </div>
      )}

      {saveSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            Your changes have been saved successfully!
            {donateAmount && (
              <span className="block mt-1">
                Added {donateAmount} {jar.tokenType} to the jar.
                {donateToCookieJarProject && donationPercentage > 0 && (
                  <span className="block mt-1 text-sm">
                    Thank you for your {donationPercentage}% donation to the Cookie Jar project team!
                  </span>
                )}
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{jar.title}</CardTitle>
            {jar.description && (
              <CardDescription className="mt-2 text-sm">{truncateText(jar.description, 120)}</CardDescription>
            )}
            <div className="mt-3 space-y-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Contract Address</p>
                <div className="flex items-center gap-2">
                  <code className="bg-muted px-2 py-1 rounded text-sm flex-1 overflow-hidden">
                    {jar.contractAddress}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(jar.contractAddress)}
                    className="shrink-0"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => window.open(`${jar.blockExplorerUrl}/address/${jar.contractAddress}`, "_blank")}
                    className="shrink-0"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-3">
                <div className="flex items-center">
                  <Network className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Badge variant="outline" className="font-normal">
                    {jar.network}
                  </Badge>
                </div>
                <div className="flex items-center">
                  <Coins className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Badge variant="secondary" className="font-normal">
                    {jar.tokenType}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-2xl font-bold">
                  {jar.balance} {jar.tokenType}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Claims</p>
                <p className="text-2xl font-bold">{jar.totalClaims}</p>
              </div>
            </div>

            <div className="space-y-6">
              <CollapsibleSection title="Jar Withdrawal Settings">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Max Withdrawal</p>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={maxWithdrawal}
                          onChange={(e) => setMaxWithdrawal(e.target.value)}
                          className={errors.maxWithdrawal ? "border-red-500" : ""}
                        />
                        <span className="text-muted-foreground">{jar.tokenType}</span>
                      </div>
                      {errors.maxWithdrawal && <p className="text-red-500 text-xs">{errors.maxWithdrawal}</p>}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Cooldown Period</p>
                      <div className="flex gap-2">
                        <Input
                          id="cooldown"
                          type="number"
                          placeholder="24"
                          value={cooldownValue}
                          onChange={(e) => setCooldownValue(e.target.value)}
                          className={errors.cooldown ? "border-red-500" : ""}
                        />
                        <Select value={cooldownUnit} onValueChange={setCooldownUnit}>
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="minutes">Minutes</SelectItem>
                            <SelectItem value="hours">Hours</SelectItem>
                            <SelectItem value="days">Days</SelectItem>
                            <SelectItem value="months">Months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {errors.cooldown && <p className="text-red-500 text-xs">{errors.cooldown}</p>}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-md font-medium">Whitelist Management</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Whitelisted Addresses</label>
                        <div className="flex gap-2">
                          <div className="relative">
                            <input
                              type="file"
                              accept=".csv,.txt"
                              onChange={handleCSVUpload}
                              ref={fileInputRef}
                              className="hidden"
                              id="csv-upload"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload CSV
                            </Button>
                          </div>
                          <Button variant="outline" size="sm" onClick={handleExportCSV}>
                            <Download className="h-4 w-4 mr-2" />
                            Export CSV
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        value={whitelistedAddresses}
                        onChange={(e) => setWhitelistedAddresses(e.target.value)}
                        rows={5}
                        placeholder="Enter addresses separated by commas, spaces, or new lines"
                        className={errors.whitelistedAddresses ? "border-red-500" : ""}
                      />
                      {errors.whitelistedAddresses && (
                        <p className="text-red-500 text-xs">{errors.whitelistedAddresses}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        These addresses will be able to withdraw funds from the jar. Enter addresses separated by
                        commas, spaces, or new lines. Addresses will be automatically formatted when saved.
                      </p>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Add Funds to Jar">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="donate-amount" className="text-sm font-medium">
                      Amount
                    </label>
                    <Input
                      id="donate-amount"
                      type="number"
                      placeholder="Enter amount"
                      value={donateAmount}
                      onChange={(e) => setDonateAmount(e.target.value)}
                      min={0}
                      className={errors.donateAmount ? "border-red-500" : ""}
                    />
                    {errors.donateAmount && <p className="text-red-500 text-xs">{errors.donateAmount}</p>}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="donate-token" className="text-sm font-medium">
                      Token
                    </label>
                    <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md">
                      <span>{jar.tokenType}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        (Funds must be added in the jar's original token)
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="donate-to-project"
                        className="h-4 w-4 rounded border-gray-300"
                        checked={donateToCookieJarProject}
                        onChange={(e) => setDonateToCookieJarProject(e.target.checked)}
                      />
                      <label htmlFor="donate-to-project" className="text-sm">
                        Donate funds to the cookie jar team to maintain this project
                      </label>
                    </div>

                    {donateToCookieJarProject && (
                      <div className="pl-6 space-y-2">
                        <label htmlFor="donation-percentage" className="text-sm font-medium">
                          Donation percentage
                        </label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="donation-percentage"
                            type="number"
                            value={donationPercentage}
                            onChange={(e) => {
                              const value = Number.parseFloat(e.target.value)
                              if (!isNaN(value) && value >= 0 && value <= 100) {
                                setDonationPercentage(value)
                              }
                            }}
                            min={0}
                            max={100}
                            step={1}
                            className="w-20"
                          />
                          <span className="text-muted-foreground">%</span>
                        </div>

                        {donateAmount && donationPercentage > 0 && (
                          <div className="text-sm text-muted-foreground mt-2">
                            Total: {(Number.parseFloat(donateAmount) * (1 + donationPercentage / 100)).toFixed(2)}{" "}
                            {jar.tokenType} = {donateAmount} {jar.tokenType} to jar +{" "}
                            {((Number.parseFloat(donateAmount) * donationPercentage) / 100).toFixed(2)} {jar.tokenType}{" "}
                            donation
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Claim History">
                <div className="space-y-2">
                  {jar.claimHistory && jar.claimHistory.length > 0 ? (
                    <div className="space-y-4 max-h-60 overflow-y-auto">
                      {jar.claimHistory.map((claim) => (
                        <div key={claim.id} className="border rounded-lg p-3 text-sm">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">
                              {claim.amount} {jar.tokenType}
                            </span>
                            <span className="text-muted-foreground">{formatDate(claim.timestamp)}</span>
                          </div>
                          <div className="mb-2">
                            <p className="text-sm italic">"{claim.reason}"</p>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">By: {formatAddress(claim.address)}</span>
                            <a
                              href={`${jar.blockExplorerUrl}/tx/${claim.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center"
                            >
                              Tx <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No claims have been made from this jar yet.
                    </div>
                  )}
                </div>
              </CollapsibleSection>
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-3 justify-between">
            <div>
              <Button
                variant="outline"
                onClick={handleRemoveAllFunds}
                className="text-red-500 border-red-200 hover:bg-red-50"
              >
                <Trash className="h-4 w-4 mr-2" />
                Remove All Funds
              </Button>
            </div>
            <div className="flex gap-3">
              <Link href={`/jar-details/${jar.id}`}>
                <Button variant="outline">View Public Page</Button>
              </Link>
              <Button onClick={handleSaveChanges}>
                <Check className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

