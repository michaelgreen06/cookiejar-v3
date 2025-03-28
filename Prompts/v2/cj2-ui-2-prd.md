# Cookie Jar v3 UI - Project Brief & Requirements Document

## Overview

Cookie Jar v3 is a decentralized application that functions as a virtual petty cash drawer, allowing organizations to create and manage funds that can be accessed by whitelisted addresses. The UI will be integrated into an existing Scaffold ETH 2 project that includes smart contract functionality.

## Technical Stack

- **Frontend Framework**: Next.js (app router)
- **Language**: TypeScript
- **UI Library**: DaisyUI (Tailwind CSS)
- **Blockchain Interaction**: Scaffold ETH 2 components
- **Design Principle**: Mobile-first responsive design

## Core Functionality

- Create and deploy Cookie Jars with configurable settings
- Fund Cookie Jars with ERC20 tokens or ETH
- Claim funds from Cookie Jars (with restrictions)
- Manage access control for Cookie Jars
- View transaction history
- Transfer jar ownership
- Support multiple EVM-compatible networks

## Global App Features

- 1% mandatory fee for all funds sent to a jar (handled at smart contract level, represented in UI)
- Claim window functionality across all jars (global for whitelist control mechanism)
- Support for all ERC20 tokens and ETH
- Jars visible to all users, even if they aren't eligible to claim from them
- Multi-chain deployment support (Optimism, Base, Gnosis, Cello, Unichain, Arbitrum)

## Pages

### Landing Page

- Two main action buttons:
  - Search for a jar
  - Create a jar
- Background image featuring cookies and cookie jars
- Footer links to GitHub, Raid Guild, partners, and Allo

### Jar Search Page

- Features:
  - Wallet connection state detection
  - Search field for entering EVM addresses (when wallet not connected)
  - Results displayed in appropriate tabs
- Components:
  - SearchField
  - SearchResults (with tabs)
  - JarOverviewCard (for each result)
- Navigation:
  - Clicking on a jar card navigates to the appropriate detail page

### Claimable Jar Detail Page

- Features:
  - Back button navigation to search results
  - Complete jar information display
  - Claim functionality
  - Transaction history
- Components:
  - JarHeaderCard
  - WithdrawCookies
  - ClaimHistory

### Adminable Jar Detail Page

- Features:
  - Access limited to jar owner wallet only
  - Complete jar administration interface
  - Danger zone for critical actions
- Components (in order):
  - JarHeaderCard
  - AddFunds
  - WithdrawalSettings
  - AccessControl
  - ClaimHistoryCard
  - JarOwnerCard
- Special Features:
  - "Empty the jar" functionality in danger zone
  - Ownership transfer options

### Jar Creation Page

- Features:
  - Requires wallet connection
  - Complete configuration options for new jar deployment
  - Single transaction deployment
- Components:
  - JarOwnerCard (defaults to connected wallet)
  - AccessControl (whitelist/blacklist configuration)
  - AddFunds (initial funding)
  - WithdrawalSettings (without individual save buttons)
- Form Fields:
  - Jar title
  - Jar description
  - Claim window
  - Network selection (with tooltip)
  - Jar token selection (with tooltip)
  - Maximum withdrawal amount
  - Initial funding amount (optional)

## Components

### SearchField

- **Purpose**: Allow users to search for jars by entering an EVM address
- **Features**:
  - Input field for EVM-compatible addresses
  - Validation for valid addresses
  - Search functionality (button and enter key)
  - Integration with blockchain provider (e.g., Infura) to query smart contracts

### SearchResults

- **Purpose**: Display search results with appropriate categorization
- **Features**:
  - Two tabs:
    - "Claim from Jars" (jars user can claim from)
    - "Manage Jars" (jars user is owner of)
  - Default tab selection based on results
  - Empty state handling with creation CTA
  - Each tab displays JarOverviewCard components for available jars

### JarOverviewCard

- **Purpose**: Provide concise overview of a jar in card format
- **Features**:
  - Jar title/name
  - Truncated description (expandable)
  - Network information (icon/badge)
  - Total jar balance with token denomination
  - Maximum withdrawal amount with token denomination
  - Claim availability timer
  - Truncated contract address with copy functionality
  - Clickable navigation to detail pages

### JarHeaderCard

- **Purpose**: Display essential jar information in all jar detail views
- **Features**:
  - Dynamic jar title with prominent typography
  - Expandable jar description
  - Current balance with token denomination and icon
  - Network badge/icon
  - Contract address with copy and explorer link
- **Contains**:
  - In claimable view:
    - ClaimHistory
    - WithdrawCookies
  - In adminable view:
    - AddFunds
    - WithdrawalSettings
    - AccessControl
    - ClaimHistoryCard
    - JarOwnerCard

### ClaimHistoryCard

- **Purpose**: Display transaction history for jar claims
- **Features**:
  - Total claims count at top
  - Chronological list of claims
  - Scrollable interface
  - Empty state handling
- **Technical Details**:
  - Virtualized scrolling for performance
  - Address truncation
  - External blockchain explorer links
  - Timestamp formatting

### ClaimTransactionCard

- **Purpose**: Display individual claim transaction details
- **Features**:
  - Claim amount with token information
  - Formatted timestamp
  - Claim reason/purpose
  - Claimer's wallet address (truncated)
  - Transaction explorer link

### WithdrawCookies

- **Purpose**: Interface for users to withdraw funds from a jar
- **Features**:
  - Withdrawal availability status with visual indicators
  - Maximum withdrawal amount display
  - Amount selection (slider and direct input)
  - Reason documentation field with validation
  - Submit action button with conditional enabling
- **Technical Details**:
  - Input synchronization between slider and numeric field
  - Real-time validation
  - Integration with cooldown system
  - Success notifications

### AddFunds

- **Purpose**: Interface for adding funds to a jar
- **Features**:
  - Amount input field with token denomination
  - Fee percentage configuration (minimum 1%)
  - Dynamic calculations showing amounts
  - Tooltips explaining token limitations
- **Technical Details**:
  - Form validation
  - Real-time fee calculations
  - Token-specific UI elements

### WithdrawalSettings

- **Purpose**: Manage withdrawal-related jar settings
- **Features**:
  - Maximum withdrawal limit configuration
  - Cooldown period management with time unit selection
  - Individual save buttons for each setting (in admin view)
- **Technical Details**:
  - Form validation for numeric inputs
  - Error handling

### AccessControl

- **Purpose**: Manage access-related jar settings
- **Contains**:
  - UserListCard (whitelist)
  - UserListCard (blacklist)
- **Features**:
  - Tooltips explaining functionality

### UserListCard

- **Purpose**: Manage address lists for jar access
- **Features**:
  - Configurable as whitelist or blacklist
  - Address management with validation
  - Individual save buttons for changes
  - Support for multiple input formats
- **Technical Details**:
  - Automatic formatting and deduplication
  - CSV import/export functionality
  - Real-time validation
  - Smart contract integration

### JarOwnerCard

- **Purpose**: Display and manage jar ownership
- **Features**:
  - Current owner address display
  - Ownership transfer functionality
  - Address validation
  - Multi-step confirmation process
- **Technical Details**:
  - Warning dialogs for critical actions
  - Form validation for new addresses

## Component Relationships and Nesting

- JarHeaderCard contains:
  - In claimable view: ClaimHistory, WithdrawCookies
  - In adminable view: AddFunds, WithdrawalSettings, AccessControl, ClaimHistoryCard, JarOwnerCard
- AccessControl contains:
  - UserListCard (whitelist)
  - UserListCard (blacklist)
- SearchResults contains:
  - Multiple JarOverviewCard instances
- ClaimHistoryCard contains:
  - Multiple ClaimTransactionCard instances
- Jar creation page contains:
  - JarOwnerCard
  - AccessControl
  - AddFunds
  - WithdrawalSettings (modified version without individual save buttons)

## Design Principles

- Consistent design patterns across all components
- Text truncation handled identically (e.g., descriptions truncated to 1 line with expansion option)
- Mobile-first responsive design
- Tooltips for complex functionality
- Visual feedback for all user actions
- Clear warning dialogs for critical actions

## Technical Implementation Notes

- Use placeholders for Scaffold ETH 2 components (e.g., AddressInput)
- Use placeholders for blockchain interactions to be replaced with functionality from Scaffold ETH 2
- Components should be built with DaisyUI for Tailwind to facilitate easy integration
- Token amounts should always display appropriate denominations
- Time displays should use appropriate units (days/hours/minutes) based on duration
- All validation should happen in real-time with appropriate user feedback

## Future Considerations

Items that may be considered for future versions:
- Multi-token jar support
- Link to specific block explorers
- CSV import/export for whitelisting