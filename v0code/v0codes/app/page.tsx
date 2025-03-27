import Link from "next/link"
import { Button } from "@/components/ui/button"
import TestHelpers from "./test-helpers"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold">Cookie Jar</h1>
        <p className="text-muted-foreground">Your virtual petty cash drawer</p>

        <div className="flex flex-col gap-4 pt-8">
          <Link href="/jar-search">
            <Button className="w-full py-6 text-lg" size="lg">
              Search for Cookie Jars
            </Button>
          </Link>

          <Link href="/create-jar">
            <Button className="w-full py-6 text-lg" size="lg">
              Create a Cookie Jar
            </Button>
          </Link>

          <Link href="/manage-jars">
            <Button className="w-full py-6 text-lg" size="lg">
              Manage My Jars
            </Button>
          </Link>
        </div>
      </div>

      {/* Include test helpers in development */}
      <TestHelpers />
    </div>
  )
}

