# Project Brief: Cookie Jar App - Next.js Implementation

## Project Overview
The Cookie Jar app is a decentralized digital petty cash system allowing users to create,
fund, and manage shared financial pools ("cookie jars") with controlled access and
withdrawal limits. The application is currently implemented as a Next.js application with mock functionality in place.

## Technical Implementation
- **Framework**: Next.js 15.2.3 with App Router
- **UI Libraries**: 
  - React 19
  - Radix UI components (with custom styling)
  - TailwindCSS 4
  - Lucide React for icons
- **State Management**: React useState for component-level state
- **Current Status**: Functional UI prototype with mock data

## Platform Support
- Primary focus on desktop experience
- Responsive design for mobile devices (leveraging Next.js and TailwindCSS capabilities)
- Modern browser compatibility

## Design Direction
- Clean, simple interface implemented with TailwindCSS
- Dark/light mode supported through Tailwind theming
- Emphasis on usability with intuitive card-based layouts

## Core Functionality (Implementation Status)
- **Create and fund cookie jars**: UI implemented, uses mock data
- **Configure access controls**: UI implemented, using mock wallets and addresses
- **Set withdrawal limits and cooldown periods**: UI implemented
- **Search for accessible or owned cookie jars**: Functional with mock data
- **Withdraw funds from jars**: UI implemented, mock functionality in place
- **Manage jar settings**: UI implemented with mock data

## Current Implementation Details

### Mock Data System
The application currently uses a comprehensive mock data system (`mock/jar-data.ts`) that simulates:
- Test wallet addresses
- Cookie jar data with realistic details
- Claim history generation
- Network information and block explorer URLs
- Utility functions for checking withdrawal eligibility and time formatting

### UI Structure (Current Implementation)

#### 1. Landing Page (`app/page.tsx`)
A clean welcome page featuring:
- App name
- Three prominent buttons linking to main functionality
- Test helpers included for development

#### 2. Jar Search Page (`app/jar-search/page.tsx`)
Search interface featuring:
- Search field for EVM address input
- Mock wallet connection functionality
- Search results displayed in responsive grid layout
- Empty state handling with helpful guidance

#### 3. Jar Creation Page (`app/create-jar/page.tsx`)
Form with input fields matching the original specification:
- Uses Radix UI components for form elements
- Mock implementation for jar creation process

#### 4. Cookie Jar Detail Page (`app/jar-details/[id]/page.tsx`)
Detailed view for individual jars:
- Displays comprehensive jar information
- Withdrawal interface with mock functionality
- Fund addition interface

#### 5. Manage My Cookie Jars Page (`app/manage-jars/page.tsx`)
Owner management interface:
- Lists jars owned by a connected wallet
- Mock implementation for jar management

#### 6. Manage Individual Jar Page (`app/manage-jar/[id]/page.tsx`)
Administrator view for jar management:
- Interface for modifying jar settings
- Mock functionality for whitelist management

## UI Components
Currently implemented components:
- EVM address input fields with validation
- Card components for jar display (using `components/ui/card.tsx`)
- Form components (inputs, buttons, selectors)
- Loading states (using skeleton loaders)
- Mock wallet connection interface

## Next Development Steps
1. **Blockchain Integration**: Connect UI to actual smart contracts
2. **Wallet Integration**: Replace mock wallet connection with real wallet providers
3. **Transaction Handling**: Implement real transaction submission and status tracking
4. **Improved Form Validation**: Enhance validation for contract addresses and other fields
5. **Testing**: Unit and integration tests for core functionality

## Known Implementation Challenges
- **Token Decimal Handling**: The maximum withdrawal amount field needs to account
for different token decimals based on the selected token contract. This is acknowledged as
an unsolved problem and will be addressed in a future implementation phase.
- **Cross-Chain Support**: Implementation for different networks needs further work

This brief reflects the current state of the Cookie Jar app implementation. The UI prototype has been implemented using Next.js and modern React patterns, with mock data in place to demonstrate functionality. The next phase will focus on connecting to actual blockchain infrastructure.