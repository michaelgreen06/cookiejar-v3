export interface ClaimHistory {
  id: string
  address: string
  amount: string
  timestamp: string
  txHash: string
  reason: string
}

export interface CookieJar {
  id: string
  title: string
  description?: string
  tokenType: string
  balance: string
  maxWithdrawal: string
  cooldownPeriod: string
  totalClaims: number
  contractAddress: string
  network: string
  owner: string // Added owner field
  lastClaimTime?: string // ISO date string of last claim
  claimHistory?: ClaimHistory[]
  blockExplorerUrl?: string // URL to block explorer for this network
}

// Sample claim reasons
const claimReasons = [
  "Purchased coffee for the team meeting",
  "Bought office supplies for the marketing department",
  "Paid for lunch during client presentation",
  "Emergency printer ink replacement",
  "Snacks for the weekly team huddle",
  "Transportation reimbursement for offsite meeting",
  "Software license renewal",
  "Conference registration fee",
  "Team building activity supplies",
  "Shipping costs for client deliverables",
  "Emergency hardware replacement",
  "Catering for product launch event",
]

// Sample EVM addresses for testing
export const testAddresses = {
  withJars: [
    "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
    "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
  ],
  withoutJars: [
    "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E",
    "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
    "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
  ],
}

// Block explorer URLs by network
export const blockExplorers: Record<string, string> = {
  Mainnet: "https://etherscan.io",
  Optimism: "https://optimistic.etherscan.io",
  Base: "https://basescan.org",
  Arbitrum: "https://arbiscan.io",
  Polygon: "https://polygonscan.com",
  Avalanche: "https://snowtrace.io",
  BSC: "https://bscscan.com",
}

// Generate a random claim history
const generateClaimHistory = (count: number, jar: Partial<CookieJar>): ClaimHistory[] => {
  const history: ClaimHistory[] = []
  const now = new Date()

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 30) + 1
    const date = new Date(now)
    date.setDate(date.getDate() - daysAgo)

    history.push({
      id: `claim-${jar.id}-${i}`,
      address: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      amount: (Math.random() * Number.parseFloat(jar.maxWithdrawal as string)).toFixed(2),
      timestamp: date.toISOString(),
      txHash: `0x${Math.random().toString(16).substring(2, 66)}`,
      reason: claimReasons[Math.floor(Math.random() * claimReasons.length)],
    })
  }

  // Sort by timestamp, newest first
  return history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

// Jar descriptions
const jarDescriptions = {
  "Team Coffee Fund":
    "A cookie jar for keeping the team caffeinated and energized. Used for purchasing coffee, tea, and other beverages for team meetings and daily consumption.",
  "Office Supplies":
    "This jar covers miscellaneous office supplies that are needed on short notice. Includes pens, notebooks, sticky notes, and other small office items.",
  "Team Lunch Fund":
    "For team lunches, celebration meals, and food during extended work sessions. Helps build team morale and keeps everyone fed during crunch time.",
  "Marketing Budget":
    "Small discretionary fund for the marketing team to cover ad-hoc expenses related to campaigns, social media, and promotional materials.",
  "Community Events":
    "Funding for community engagement activities, meetups, and local events. Helps us maintain a strong presence in the developer community.",
  "Development Tools":
    "For purchasing small development tools, plugins, and utilities that help improve workflow and productivity for the engineering team.",
  "Conference Travel":
    "Covers small expenses related to conference attendance such as local transportation, meals, and networking events.",
  "Research Fund":
    "Dedicated to research activities, including access to papers, specialized tools, and experimental materials.",
  "Emergency Fund":
    "Reserved for unexpected urgent expenses that need immediate attention without going through the standard procurement process.",
}

// Mock jar data mapped to addresses
export const mockJarsByAddress: Record<string, CookieJar[]> = {
  // First test address with jars
  [testAddresses.withJars[0]]: [
    {
      id: "1",
      title: "Team Coffee Fund",
      description: jarDescriptions["Team Coffee Fund"],
      tokenType: "USDC",
      balance: "250.00",
      maxWithdrawal: "25.00",
      cooldownPeriod: "24 hours",
      totalClaims: 12,
      contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
      network: "Optimism",
      owner: testAddresses.withJars[0], // Owner is the same as the address with access
      lastClaimTime: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 36 hours ago
      blockExplorerUrl: blockExplorers["Optimism"],
    },
    {
      id: "2",
      title: "Office Supplies",
      description: jarDescriptions["Office Supplies"],
      tokenType: "DAI",
      balance: "500.00",
      maxWithdrawal: "50.00",
      cooldownPeriod: "48 hours",
      totalClaims: 5,
      contractAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
      network: "Base",
      owner: testAddresses.withJars[0], // Owner is the same as the address with access
      lastClaimTime: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      blockExplorerUrl: blockExplorers["Base"],
    },
    {
      id: "3",
      title: "Team Lunch Fund",
      description: jarDescriptions["Team Lunch Fund"],
      tokenType: "ETH",
      balance: "0.75",
      maxWithdrawal: "0.05",
      cooldownPeriod: "7 days",
      totalClaims: 3,
      contractAddress: "0x7890abcdef1234567890abcdef1234567890abcd",
      network: "Mainnet",
      owner: testAddresses.withJars[0], // Owner is the same as the address with access
      lastClaimTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      blockExplorerUrl: blockExplorers["Mainnet"],
    },
  ],

  // Second test address with jars
  [testAddresses.withJars[1]]: [
    {
      id: "4",
      title: "Marketing Budget",
      description: jarDescriptions["Marketing Budget"],
      tokenType: "USDT",
      balance: "1000.00",
      maxWithdrawal: "100.00",
      cooldownPeriod: "72 hours",
      totalClaims: 8,
      contractAddress: "0xdef1234567890abcdef1234567890abcdef123456",
      network: "Arbitrum",
      owner: testAddresses.withJars[1], // Owner is the same as the address with access
      lastClaimTime: new Date(Date.now() - 80 * 60 * 60 * 1000).toISOString(), // 80 hours ago
      blockExplorerUrl: blockExplorers["Arbitrum"],
    },
    {
      id: "5",
      title: "Community Events",
      description: jarDescriptions["Community Events"],
      tokenType: "MATIC",
      balance: "2500.00",
      maxWithdrawal: "250.00",
      cooldownPeriod: "5 days",
      totalClaims: 2,
      contractAddress: "0x567890abcdef1234567890abcdef1234567890abc",
      network: "Polygon",
      owner: testAddresses.withJars[1], // Owner is the same as the address with access
      lastClaimTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      blockExplorerUrl: blockExplorers["Polygon"],
    },
  ],

  // Third test address with jars
  [testAddresses.withJars[2]]: [
    {
      id: "6",
      title: "Development Tools",
      description: jarDescriptions["Development Tools"],
      tokenType: "AVAX",
      balance: "300.00",
      maxWithdrawal: "30.00",
      cooldownPeriod: "36 hours",
      totalClaims: 15,
      contractAddress: "0x90abcdef1234567890abcdef1234567890abcdef1",
      network: "Avalanche",
      owner: testAddresses.withJars[2], // Owner is the same as the address with access
      lastClaimTime: new Date(Date.now() - 40 * 60 * 60 * 1000).toISOString(), // 40 hours ago
      blockExplorerUrl: blockExplorers["Avalanche"],
    },
    {
      id: "7",
      title: "Conference Travel",
      description: jarDescriptions["Conference Travel"],
      tokenType: "BNB",
      balance: "5.5",
      maxWithdrawal: "0.5",
      cooldownPeriod: "14 days",
      totalClaims: 1,
      contractAddress: "0x4567890abcdef1234567890abcdef1234567890ab",
      network: "BSC",
      owner: testAddresses.withJars[2], // Owner is the same as the address with access
      lastClaimTime: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
      blockExplorerUrl: blockExplorers["BSC"],
    },
    {
      id: "8",
      title: "Research Fund",
      description: jarDescriptions["Research Fund"],
      tokenType: "LINK",
      balance: "750.00",
      maxWithdrawal: "75.00",
      cooldownPeriod: "48 hours",
      totalClaims: 6,
      contractAddress: "0xcdef1234567890abcdef1234567890abcdef12345",
      network: "Mainnet",
      owner: testAddresses.withJars[2], // Owner is the same as the address with access
      lastClaimTime: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(), // 30 hours ago
      blockExplorerUrl: blockExplorers["Mainnet"],
    },
    {
      id: "9",
      title: "Emergency Fund",
      description: jarDescriptions["Emergency Fund"],
      tokenType: "ETH",
      balance: "2.0",
      maxWithdrawal: "0.1",
      cooldownPeriod: "24 hours",
      totalClaims: 0,
      contractAddress: "0xef1234567890abcdef1234567890abcdef1234567",
      network: "Optimism",
      owner: testAddresses.withJars[2], // Owner is the same as the address with access
      lastClaimTime: undefined, // Never claimed
      blockExplorerUrl: blockExplorers["Optimism"],
    },
  ],
}

// Add claim history to all jars
Object.values(mockJarsByAddress).forEach((jars) => {
  jars.forEach((jar) => {
    jar.claimHistory = generateClaimHistory(jar.totalClaims, jar)
  })
})

// Function to get jars for a given address
export function getJarsForAddress(address: string): CookieJar[] {
  // Normalize the address (lowercase)
  const normalizedAddress = address.toLowerCase()

  // Check all addresses (case insensitive)
  for (const [addr, jars] of Object.entries(mockJarsByAddress)) {
    if (addr.toLowerCase() === normalizedAddress) {
      return jars
    }
  }

  // No jars found for this address
  return []
}

// Function to get jars owned by a given address
export function getJarsOwnedByAddress(address: string): CookieJar[] {
  // Normalize the address (lowercase)
  const normalizedAddress = address.toLowerCase()

  // Collect all jars where the owner matches the provided address
  const ownedJars: CookieJar[] = []

  for (const jars of Object.values(mockJarsByAddress)) {
    for (const jar of jars) {
      if (jar.owner.toLowerCase() === normalizedAddress) {
        ownedJars.push(jar)
      }
    }
  }

  return ownedJars
}

// Function to check if an address has jars
export function hasJars(address: string): boolean {
  return getJarsForAddress(address).length > 0
}

// Function to check if an address owns any jars
export function ownsJars(address: string): boolean {
  return getJarsOwnedByAddress(address).length > 0
}

// Function to get a jar by ID
export function getJarById(id: string): CookieJar | undefined {
  for (const jars of Object.values(mockJarsByAddress)) {
    const jar = jars.find((jar) => jar.id === id)
    if (jar) return jar
  }
  return undefined
}

// Function to check if a user can withdraw from a jar
export function canWithdraw(jar: CookieJar): boolean {
  if (!jar.lastClaimTime) return true // Never claimed before

  const lastClaim = new Date(jar.lastClaimTime)
  const now = new Date()

  // Parse cooldown period
  let cooldownHours = 24 // Default to 24 hours

  if (jar.cooldownPeriod.includes("hour")) {
    cooldownHours = Number.parseInt(jar.cooldownPeriod.split(" ")[0])
  } else if (jar.cooldownPeriod.includes("day")) {
    cooldownHours = Number.parseInt(jar.cooldownPeriod.split(" ")[0]) * 24
  }

  // Calculate time difference in hours
  const hoursSinceLastClaim = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60)

  return hoursSinceLastClaim >= cooldownHours
}

// Function to format a date
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Function to get time until next withdrawal
export function getTimeUntilNextWithdrawal(jar: CookieJar): string {
  if (!jar.lastClaimTime) return "Available now"
  if (canWithdraw(jar)) return "Available now"

  const lastClaim = new Date(jar.lastClaimTime)
  const now = new Date()

  // Parse cooldown period
  let cooldownHours = 24 // Default to 24 hours

  if (jar.cooldownPeriod.includes("hour")) {
    cooldownHours = Number.parseInt(jar.cooldownPeriod.split(" ")[0])
  } else if (jar.cooldownPeriod.includes("day")) {
    cooldownHours = Number.parseInt(jar.cooldownPeriod.split(" ")[0]) * 24
  }

  // Calculate next available time
  const nextAvailable = new Date(lastClaim.getTime() + cooldownHours * 60 * 60 * 1000)
  const diffMs = nextAvailable.getTime() - now.getTime()

  if (diffMs <= 0) return "Available now"

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  if (diffHours > 0) {
    return `Available in ${diffHours}h ${diffMinutes}m`
  } else {
    return `Available in ${diffMinutes}m`
  }
}

// Function to truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

