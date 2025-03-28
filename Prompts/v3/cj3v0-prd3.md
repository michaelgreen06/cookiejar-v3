# Cookie Jar v3 - Project Brief for V0

## Project Overview
Cookie Jar is a web application that acts as a virtual petty cash drawer for organizations and communities. It allows users to create, manage, and claim funds from shared "cookie jars" - accessible pools of ERC20 tokens or ETH that authorized users can withdraw from according to set rules.

## Design Requirements
- Mobile-first responsive design
- Clean, modern UI with cookie/jar themed elements
- Consistent design patterns across all components
- Each page includes navigation elements (back arrows to previous pages)

## Core Pages

### 1. Landing Page
- Two prominent buttons:
  - "Search for a Jar" - Leads to jar search page
  - "Create a Jar" - Leads to jar creation page
- Background image featuring cookies and cookie jars
- Footer with links to GitHub, Raid Guild & partners, Allo

### 2. Jar Search Page
- Contains `SearchField` component when wallet not connected
- Display options:
  - Connect wallet button (when wallet not connected)
  - Search results shown in tabs (when results available)

### 3. Jar Detail Pages (for claiming)
- Contains `JarHeader` component with:
  - `ClaimHistory` component (which contains `ClaimTransaction` components)
  - `WithdrawCookies` component

### 4. Jar Admin Page
- Contains `JarHeader` component with:
  - `AddFunds` component
  - `WithdrawalSettings` component
  - `AccessControl` component (which contains `UserList` components)
  - `ClaimHistory` component
  - `JarOwner` component
  - "Danger zone" section with jar emptying functionality

### 5. Jar Creation Page
- Form with the following fields:
  - Jar title
  - Jar description
  - Jar token selection (with tooltip)
  - Initial funding amount (optional)
- The following components are embedded:
  - `JarWithdrawalSettings` component (containing maximum withdrawal amount and claim window)
  - `AccessControl` component (for whitelist/blacklist)
  - `AddFunds` component (adjusted for initial funding)
  - `JarOwner` component (defaults to creator's address)
- "Create Cookie Jar" button at bottom

## Core Components

### JarHeader
- Primary container component for jar-specific information
- Contains:
  - Jar title (prominent typography)
  - Jar description (truncated to 1 line, expandable)
  - Current balance with token icon
  - Network badge/icon
  - Contract address with copy and block explorer functionality
- All other jar-specific components are nested within this component

### SearchField
- Input field for EVM-compatible addresses
- Search button
- Searches when enter is pressed

### SearchResults
- Two tabs:
  - "Claim from Jars" - Lists jars users can claim from
  - "Manage Jars" - Lists jars users are owners of
- Each tab displays `JarOverview` cards for available jars
- Default tab: "Claim from Jars" if user has access to both types

### JarOverview
- Displays:
  - Jar title/name
  - Jar description (truncated to 1 line, expandable)
  - Network icon/badge
  - Total jar balance with token denomination
  - Maximum withdrawal amount with token denomination
  - Claimable timer (days/hours/minutes/now)
  - Truncated jar address with copy functionality
- Clickable card leading to appropriate detail page

### ClaimHistory
- Shows total claims count at the top
- Scrollable section containing `ClaimTransaction` components
- Chronological list of all claims made against the jar

### ClaimTransaction
- Displays:
  - Claimer's address (truncated)
  - Claim amount with token denomination
  - Timestamp (relative time)
  - Claim reason (truncated, expandable)
  - Transaction hash with link to block explorer

### WithdrawCookies
- Shows withdrawal availability status:
  - Green checkmark for available withdrawals
  - Clock icon with countdown timer for cooldown periods
  - Tooltip explaining cooldown functionality
- Maximum withdrawal amount displayed with token denomination
- Amount selection:
  - Slider control
  - Direct numerical input
  - Token type shown as denominator
- Reason documentation field:
  - Character count tracking (minimum 20 characters required)
  - Validation error messaging
- "Withdraw Cookies" button (conditionally enabled)

### AddFunds
- Collapsible section for adding funds
- Amount input field denominated in jar's token
- Tooltip explaining jars only accept their original token
- Options for specifying:
  - Total amount added (including fees)
  - Amount going to jar (excluding fees)
- Adjustable fee percentage (minimum 1%)
- Real-time calculation showing jar funding and fee amounts

### WithdrawalSettings
- Collapsible section for withdrawal settings
- Maximum withdrawal limit configuration with token-specific settings
- Cooldown period management with flexible time unit selection
- Each setting has its own save button (for admin page only)
- Tooltip explaining cooldown period functionality

### AccessControl
- Collapsible section for access control
- Contains:
  - `UserList` component configured for whitelist
  - `UserList` component configured for blacklist
- Both with tooltips explaining functionality

### UserList
- Configurable as whitelist or blacklist
- Manual address entry with EVM validation
- uses comma or newline separating
- allows csv imports and exports
- Save button for each change (on admin page only)
- Automatic formatting and validation

### JarOwner
- Collapsible section for jar ownership settings 
- Shows current owner address
- Provides functionality to transfer ownership
- Address validation checking
- Edit button with confirmation flow

## Technical Requirements
- Real-time validation for all forms
- Token-aware UI elements (showing proper denominations)
- Responsive design for all screen sizes
- Text truncation with progressive disclosure
- Loading states and transaction feedback
- Consistent error handling

## Important Details to Emphasize
- Claim reason must be at least 20 characters
- 1% mandatory fee on all funds sent to jar
- Claim window is global for whitelist control
- Only jar owner can modify jar settings
- Jar token selection can never be changed after creation
- Maximum withdrawal amount and claim window settings are in the JarWithdrawalSettings component