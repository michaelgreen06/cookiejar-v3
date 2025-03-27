"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, ExternalLink, Copy, Clock, Check, Cookie, AlertCircle, Network, Coins } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  getJarById,
  canWithdraw,
  formatDate,
  getTimeUntilNextWithdrawal,
  truncateText,
  type CookieJar,
} from "@/mock/jar-data"

export default function JarDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const [jar, setJar] = useState<CookieJar | null>(null)
  const [loading, setLoading] = useState(true)
  const [withdrawAmount, setWithdrawAmount] = useState(0)
  const [withdrawReason, setWithdrawReason] = useState("")
  const [donateAmount, setDonateAmount] = useState("")
  const [copied, setCopied] = useState(false)
  const [withdrawSuccess, setWithdrawSuccess] = useState(false)
  const [donateSuccess, setDonateSuccess] = useState(false)
  const [reasonError, setReasonError] = useState(false)
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [donateToCookieJarProject, setDonateToCookieJarProject] = useState(true)
  const [donationPercentage, setDonationPercentage] = useState(5)

  useEffect(() => {
    // Simulate loading the jar data
    setLoading(true)
    setTimeout(() => {
      const foundJar = getJarById(id as string)
      if (foundJar) {
        setJar(foundJar)
        // Initialize withdraw amount to 10% of max
        setWithdrawAmount(Number.parseFloat(foundJar.maxWithdrawal) * 0.1)
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

  const handleWithdraw = () => {
    // Check if reason is at least 20 characters
    if (withdrawReason.length < 20) {
      setReasonError(true)
      return
    }

    setReasonError(false)

    // Simulate withdrawal transaction
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setWithdrawSuccess(true)
      setTimeout(() => setWithdrawSuccess(false), 5000)

      // Update jar data to reflect withdrawal
      if (jar) {
        const updatedJar = {
          ...jar,
          balance: (Number.parseFloat(jar.balance) - withdrawAmount).toFixed(2),
          lastClaimTime: new Date().toISOString(),
          totalClaims: jar.totalClaims + 1,
          claimHistory: [
            {
              id: `claim-${jar.id}-${jar.totalClaims + 1}`,
              address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", // Connected wallet
              amount: withdrawAmount.toString(),
              timestamp: new Date().toISOString(),
              txHash: `0x${Math.random().toString(16).substring(2, 66)}`,
              reason: withdrawReason,
            },
            ...(jar.claimHistory || []),
          ],
        }
        setJar(updatedJar)
        setWithdrawReason("")
      }
    }, 2000)
  }

  const handleDonate = () => {
    // Simulate donation transaction
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setDonateSuccess(true)
      setTimeout(() => setDonateSuccess(false), 5000)

      // Update jar data to reflect donation
      if (jar && donateAmount) {
        const updatedJar = {
          ...jar,
          balance: (Number.parseFloat(jar.balance) + Number.parseFloat(donateAmount)).toFixed(2),
        }
        setJar(updatedJar)
        setDonateAmount("")
      }
    }, 2000)
  }

  if (loading && !jar) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/jar-search" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to search</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Cookie Jar Details</h1>
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
          <Link href="/jar-search" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to search</span>
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Cookie Jar Details</h1>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Cookie Jar Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The cookie jar you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/jar-search">
              <Button>Back to Search</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const canUserWithdraw = canWithdraw(jar)
  const nextWithdrawalTime = getTimeUntilNextWithdrawal(jar)
  const maxWithdrawalValue = Number.parseFloat(jar.maxWithdrawal)

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/jar-search" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to search</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Cookie Jar Details</h1>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="ml-2">Processing transaction...</p>
          </div>
        </div>
      )}

      {donateSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            Successfully added funds to the cookie jar!
            {donateToCookieJarProject && donationPercentage > 0 && (
              <span className="block mt-1 text-sm">
                Thank you for your {donationPercentage}% donation to the Cookie Jar project team!
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {withdrawSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-600">
            Successfully withdrew {withdrawAmount} {jar.tokenType} from the cookie jar!
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{jar.title}</CardTitle>
              {jar.description && (
                <CardDescription className="mt-2 text-sm">
                  {showFullDescription ? jar.description : truncateText(jar.description, 120)}
                  {jar.description.length > 120 && (
                    <Button
                      variant="link"
                      className="p-0 h-auto text-xs ml-1"
                      onClick={() => setShowFullDescription(!showFullDescription)}
                    >
                      {showFullDescription ? "Show less" : "Read more"}
                    </Button>
                  )}
                </CardDescription>
              )}
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
                  <p className="text-sm text-muted-foreground">Max Withdrawal</p>
                  <p className="text-2xl font-bold">
                    {jar.maxWithdrawal} {jar.tokenType}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Cooldown Period</p>
                  <p className="text-lg">{jar.cooldownPeriod}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Claims</p>
                  <p className="text-lg">{jar.totalClaims}</p>
                </div>
              </div>

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

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Claim History</h3>
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
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Withdraw Cookies</CardTitle>
              <CardDescription>
                {canUserWithdraw ? (
                  <span className="text-green-600 flex items-center">
                    <Check className="h-4 w-4 mr-1" /> Available now
                  </span>
                ) : (
                  <span className="text-amber-600 flex items-center">
                    <Clock className="h-4 w-4 mr-1" /> {nextWithdrawalTime}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="amount" className="text-sm font-medium">
                    Amount
                  </label>
                  <span className="text-sm text-muted-foreground">
                    Max: {jar.maxWithdrawal} {jar.tokenType}
                  </span>
                </div>
                <div className="space-y-4">
                  <Slider
                    id="amount"
                    min={0}
                    max={maxWithdrawalValue}
                    step={maxWithdrawalValue / 100}
                    value={[withdrawAmount]}
                    onValueChange={(value) => setWithdrawAmount(value[0])}
                    disabled={!canUserWithdraw}
                  />
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => {
                        const value = Number.parseFloat(e.target.value)
                        if (!isNaN(value) && value >= 0 && value <= maxWithdrawalValue) {
                          setWithdrawAmount(value)
                        }
                      }}
                      min={0}
                      max={maxWithdrawalValue}
                      step={maxWithdrawalValue / 100}
                      disabled={!canUserWithdraw}
                    />
                    <span className="text-muted-foreground">{jar.tokenType}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="reason" className="text-sm font-medium">
                    Reason for withdrawal
                  </label>
                  <span className="text-xs text-muted-foreground">{withdrawReason.length}/20 characters minimum</span>
                </div>
                <Textarea
                  id="reason"
                  placeholder="Please provide a reason for this withdrawal (min 20 characters)"
                  value={withdrawReason}
                  onChange={(e) => {
                    setWithdrawReason(e.target.value)
                    if (e.target.value.length >= 20) {
                      setReasonError(false)
                    }
                  }}
                  disabled={!canUserWithdraw}
                  className={reasonError ? "border-red-500" : ""}
                />
                {reasonError && (
                  <p className="text-red-500 text-xs">Please provide a reason with at least 20 characters</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleWithdraw} disabled={!canUserWithdraw || withdrawAmount <= 0}>
                <Cookie className="h-4 w-4 mr-2" />
                Withdraw Cookies
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Funds to Jar</CardTitle>
              <CardDescription>Help keep this cookie jar filled!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                />
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
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant="outline"
                onClick={handleDonate}
                disabled={!donateAmount || Number.parseFloat(donateAmount) <= 0}
              >
                Add Funds to Jar
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

