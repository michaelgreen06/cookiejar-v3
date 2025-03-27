"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, Upload, Cookie } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { blockExplorers } from "@/mock/jar-data"

// Token options with their details
const tokenOptions = {
  USDC: { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", decimals: 6 },
  DAI: { address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", decimals: 18 },
  USDT: { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6 },
  ETH: { address: "native", decimals: 18 },
  CELLO: { address: "0x4F9254C83EB525f9FCf346490bbb3ed28a81C667", decimals: 18 },
  CUSTOM: { address: "", decimals: 18 },
}

export default function CreateJarPage() {
  // Form state
  const [owner, setOwner] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [cooldownValue, setCooldownValue] = useState("")
  const [cooldownUnit, setCooldownUnit] = useState("hours")
  const [selectedToken, setSelectedToken] = useState("")
  const [customTokenAddress, setCustomTokenAddress] = useState("")
  const [customTokenSymbol, setCustomTokenSymbol] = useState("")
  const [network, setNetwork] = useState("")
  const [maxWithdrawal, setMaxWithdrawal] = useState("")
  const [whitelistedAddresses, setWhitelistedAddresses] = useState("")
  const [initialFunding, setInitialFunding] = useState("")
  const [donateToCookieJarProject, setDonateToCookieJarProject] = useState(true)
  const [donationPercentage, setDonationPercentage] = useState(5)

  // UI state
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Derived values
  const getTokenSymbol = () => {
    if (selectedToken === "CUSTOM") return customTokenSymbol || "Token"
    return selectedToken
  }

  const getTokenAddress = () => {
    if (selectedToken === "CUSTOM") return customTokenAddress
    return selectedToken ? tokenOptions[selectedToken as keyof typeof tokenOptions].address : ""
  }

  // Validation functions
  const isValidEVMAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  }

  const validateAddresses = (addresses: string) => {
    if (!addresses.trim()) return true

    const addressList = addresses
      .split(/[\s,]+/)
      .map((addr) => addr.trim())
      .filter((addr) => addr.length > 0)

    return addressList.every((addr) => isValidEVMAddress(addr))
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
          .filter((addr) => addr.length > 0)
          .join(", ")

        setWhitelistedAddresses((prev) => (prev ? `${prev}, ${addresses}` : addresses))
      }
    }
    reader.readAsText(file)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!owner) {
      newErrors.owner = "Jar owner address is required"
    } else if (!isValidEVMAddress(owner)) {
      newErrors.owner = "Please enter a valid EVM address"
    }

    if (!title) {
      newErrors.title = "Jar title is required"
    }

    if (!description) {
      newErrors.description = "Jar description is required"
    }

    if (!cooldownValue) {
      newErrors.cooldown = "Cooldown period is required"
    } else if (isNaN(Number(cooldownValue)) || Number(cooldownValue) <= 0) {
      newErrors.cooldown = "Please enter a valid cooldown period"
    }

    if (!selectedToken) {
      newErrors.token = "Token selection is required"
    }

    if (selectedToken === "CUSTOM") {
      if (!customTokenAddress) {
        newErrors.customTokenAddress = "Custom token address is required"
      } else if (!isValidEVMAddress(customTokenAddress)) {
        newErrors.customTokenAddress = "Please enter a valid EVM address"
      }

      if (!customTokenSymbol) {
        newErrors.customTokenSymbol = "Custom token symbol is required"
      }
    }

    if (!network) {
      newErrors.network = "Network selection is required"
    }

    if (!maxWithdrawal) {
      newErrors.maxWithdrawal = "Maximum withdrawal amount is required"
    } else if (isNaN(Number(maxWithdrawal)) || Number(maxWithdrawal) <= 0) {
      newErrors.maxWithdrawal = "Please enter a valid withdrawal amount"
    }

    if (whitelistedAddresses && !validateAddresses(whitelistedAddresses)) {
      newErrors.whitelistedAddresses = "One or more addresses are invalid"
    }

    if (initialFunding && (isNaN(Number(initialFunding)) || Number(initialFunding) < 0)) {
      newErrors.initialFunding = "Please enter a valid funding amount"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    // Simulate jar creation
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)

      // Show confetti animation
      showCookieConfetti()

      // Reset form after a delay
      setTimeout(() => {
        setSuccess(false)
      }, 5000)
    }, 2000)
  }

  const showCookieConfetti = () => {
    // This would be implemented with a cookie confetti animation
    // For now, we'll just log to console
    console.log("🍪 Cookie confetti! 🍪")
  }

  const calculateTotalAmount = () => {
    if (!initialFunding || isNaN(Number(initialFunding))) return "0"

    const fundingAmount = Number(initialFunding)
    if (donateToCookieJarProject && donationPercentage > 0) {
      const donationAmount = fundingAmount * (donationPercentage / 100)
      return (fundingAmount + donationAmount).toFixed(2)
    }

    return fundingAmount.toFixed(2)
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to home</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Create a Cookie Jar</h1>
      </div>

      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <Cookie className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            Your cookie jar has been successfully created! Fresh cookies are ready to be shared.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Bake a New Cookie Jar</CardTitle>
          <CardDescription>
            Fill in the details below to create a new cookie jar for your team or project.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="owner">
                    Jar Owner Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="owner"
                    placeholder="0x..."
                    value={owner}
                    onChange={(e) => setOwner(e.target.value)}
                    className={errors.owner ? "border-red-500" : ""}
                  />
                  {errors.owner && <p className="text-red-500 text-xs">{errors.owner}</p>}
                  <p className="text-xs text-muted-foreground">
                    The EVM address that will have owner permissions for this jar
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">
                    Jar Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="Team Coffee Fund"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Jar Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this cookie jar will be used for..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Jar Configuration</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="token">
                    Cookie Token <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={selectedToken}
                    onValueChange={(value) => {
                      setSelectedToken(value)
                      if (value !== "CUSTOM") {
                        setCustomTokenAddress("")
                        setCustomTokenSymbol("")
                      }
                    }}
                  >
                    <SelectTrigger className={errors.token ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USDC">USDC</SelectItem>
                      <SelectItem value="DAI">DAI</SelectItem>
                      <SelectItem value="USDT">USDT</SelectItem>
                      <SelectItem value="ETH">ETH</SelectItem>
                      <SelectItem value="CELLO">CELLO</SelectItem>
                      <SelectItem value="CUSTOM">Custom ERC20 Token</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.token && <p className="text-red-500 text-xs">{errors.token}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="network">
                    Network <span className="text-red-500">*</span>
                  </Label>
                  <Select value={network} onValueChange={setNetwork}>
                    <SelectTrigger className={errors.network ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select network" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(blockExplorers).map((net) => (
                        <SelectItem key={net} value={net}>
                          {net}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.network && <p className="text-red-500 text-xs">{errors.network}</p>}
                </div>
              </div>

              {selectedToken === "CUSTOM" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="customTokenAddress">
                      Custom Token Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="customTokenAddress"
                      placeholder="0x..."
                      value={customTokenAddress}
                      onChange={(e) => setCustomTokenAddress(e.target.value)}
                      className={errors.customTokenAddress ? "border-red-500" : ""}
                    />
                    {errors.customTokenAddress && <p className="text-red-500 text-xs">{errors.customTokenAddress}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customTokenSymbol">
                      Custom Token Symbol <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="customTokenSymbol"
                      placeholder="TOKEN"
                      value={customTokenSymbol}
                      onChange={(e) => setCustomTokenSymbol(e.target.value)}
                      className={errors.customTokenSymbol ? "border-red-500" : ""}
                    />
                    {errors.customTokenSymbol && <p className="text-red-500 text-xs">{errors.customTokenSymbol}</p>}
                  </div>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cooldown">
                    Cooldown Period <span className="text-red-500">*</span>
                  </Label>
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
                  <p className="text-xs text-muted-foreground">How long users must wait between withdrawals</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxWithdrawal">
                    Maximum Withdrawal <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="maxWithdrawal"
                      type="number"
                      placeholder="25"
                      value={maxWithdrawal}
                      onChange={(e) => setMaxWithdrawal(e.target.value)}
                      className={errors.maxWithdrawal ? "border-red-500" : ""}
                    />
                    <div className="w-[120px] flex items-center justify-center bg-muted rounded-md px-3">
                      {getTokenSymbol()}
                    </div>
                  </div>
                  {errors.maxWithdrawal && <p className="text-red-500 text-xs">{errors.maxWithdrawal}</p>}
                  <p className="text-xs text-muted-foreground">
                    Maximum amount that can be withdrawn in a single transaction
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Access Control</h3>

              <div className="space-y-2">
                <Label htmlFor="whitelistedAddresses">Whitelisted Addresses</Label>
                <Textarea
                  id="whitelistedAddresses"
                  placeholder="Enter addresses separated by commas or spaces..."
                  value={whitelistedAddresses}
                  onChange={(e) => setWhitelistedAddresses(e.target.value)}
                  rows={4}
                  className={errors.whitelistedAddresses ? "border-red-500" : ""}
                />
                {errors.whitelistedAddresses && <p className="text-red-500 text-xs">{errors.whitelistedAddresses}</p>}
                <p className="text-xs text-muted-foreground">
                  These addresses will be able to withdraw funds from the jar. Separate multiple addresses with commas
                  or spaces.
                </p>

                <div className="mt-2">
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleCSVUpload}
                    ref={fileInputRef}
                    className="hidden"
                    id="csv-upload"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload CSV
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Funding</h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="initialFunding">Initial Funding Amount</Label>
                  <div className="flex gap-2">
                    <Input
                      id="initialFunding"
                      type="number"
                      placeholder="0"
                      value={initialFunding}
                      onChange={(e) => setInitialFunding(e.target.value)}
                      className={errors.initialFunding ? "border-red-500" : ""}
                    />
                    <div className="w-[120px] flex items-center justify-center bg-muted rounded-md px-3">
                      {getTokenSymbol()}
                    </div>
                  </div>
                  {errors.initialFunding && <p className="text-red-500 text-xs">{errors.initialFunding}</p>}
                  <p className="text-xs text-muted-foreground">Amount to initially fund the jar with (can be 0)</p>
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

                    {initialFunding && donationPercentage > 0 && (
                      <div className="text-sm text-muted-foreground mt-2">
                        Total: {calculateTotalAmount()} {getTokenSymbol()} = {initialFunding} {getTokenSymbol()} to jar
                        + {((Number(initialFunding) * donationPercentage) / 100).toFixed(2)} {getTokenSymbol()} donation
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" size="lg" onClick={handleSubmit} disabled={loading} className="w-full md:w-auto">
            {loading ? (
              <>
                <div className="inline-block h-4 w-4 mr-2 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                Creating Jar...
              </>
            ) : (
              <>
                <Cookie className="h-4 w-4 mr-2" />
                Create Cookie Jar
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

