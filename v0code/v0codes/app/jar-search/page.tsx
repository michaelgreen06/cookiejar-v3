"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Wallet, ArrowLeft, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { type CookieJar, getJarsForAddress, testAddresses } from "@/mock/jar-data"

export default function JarSearchPage() {
  const [address, setAddress] = useState("")
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [jars, setJars] = useState<CookieJar[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setSearchPerformed(true)
      // Get jars for the entered address using our mock data
      if (address.trim().length > 0) {
        const foundJars = getJarsForAddress(address)
        setJars(foundJars)
      } else {
        setJars([])
      }
      setIsLoading(false)
    }, 1000)
  }

  const connectWallet = () => {
    // Simulate wallet connection with one of our test addresses
    setIsLoading(true)
    setTimeout(() => {
      const connectedAddress = testAddresses.withJars[0] // Use first address with jars
      setIsWalletConnected(true)
      setAddress(connectedAddress)
      setIsLoading(false)
    }, 1000)
  }

  const resetSearch = () => {
    setSearchPerformed(false)
    setJars([])
    if (!isWalletConnected) {
      setAddress("")
    }
  }

  const formatAddress = (address: string) => {
    if (!address || address.length < 10) return address
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
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
        <h1 className="text-2xl font-bold">Find Cookie Jars</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Enter EVM address (0x...)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={isWalletConnected || isLoading}
                className="w-full"
              />
            </div>
            {!isWalletConnected && (
              <Button onClick={connectWallet} disabled={isLoading} className="whitespace-nowrap">
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            )}
            <Button onClick={handleSearch} disabled={(!address && !isWalletConnected) || isLoading}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
          {isWalletConnected && <p className="text-sm text-muted-foreground">Connected: {formatAddress(address)}</p>}
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2 text-muted-foreground">Searching for cookie jars...</p>
        </div>
      )}

      {searchPerformed && !isLoading && (
        <div className="space-y-6">
          {jars.length > 0 ? (
            <>
              <h2 className="text-lg font-medium">Found {jars.length} cookie jars</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {jars.map((jar) => (
                  <Card key={jar.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">{jar.title}</h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <div className="text-muted-foreground">Token:</div>
                        <div>{jar.tokenType}</div>
                        <div className="text-muted-foreground">Balance:</div>
                        <div>{jar.balance}</div>
                        <div className="text-muted-foreground">Max Withdrawal:</div>
                        <div>{jar.maxWithdrawal}</div>
                        <div className="text-muted-foreground">Cooldown:</div>
                        <div>{jar.cooldownPeriod}</div>
                        <div className="text-muted-foreground">Claims:</div>
                        <div>{jar.totalClaims}</div>
                        <div className="text-muted-foreground">Network:</div>
                        <div>{jar.network}</div>
                        <div className="text-muted-foreground">Contract:</div>
                        <div className="flex items-center">
                          <span className="truncate">{formatAddress(jar.contractAddress)}</span>
                          <ExternalLink className="h-3 w-3 ml-1 inline-block" />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-muted/50 px-6 py-3">
                      <Link href={`/jar-details/${jar.id}`} className="w-full">
                        <Button variant="default" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-muted/20 rounded-lg border">
              <div className="max-w-md mx-auto space-y-6">
                <p className="text-lg">Looks like the provided address doesn't have access to any cookie jars 😢</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="outline" onClick={resetSearch}>
                    Search for a new address
                  </Button>
                  <Link href="/create-jar">
                    <Button>Create a Cookie Jar</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

