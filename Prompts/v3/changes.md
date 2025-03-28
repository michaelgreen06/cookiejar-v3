 search-results page
    the placeholder text on the searchfield component should say: enter an evm compatiable address
    the message that shows up when no jars are found should say: Looks like you don't have access to any jars 😭 <button> click here to create a jar<button>
    the page should maintain state when an address has been entered and a user clicks on a jar the address has access to. EG I search for an address then click on the claimable jar then navigate back to the search-results page. I still want to see the jars that address has access to
---
create a popup when I visit the home page that lists the address of users that have access to claim from jars and have access to admin jars.  

search-results page 
    should have a back button to home page
    please modify searchfield to not have the create buttton. when a user has no jars, the searchfield should be the only component on the page and underneath the user will see a message that they don't have any jars and then there will be a button that gives them the option to craete a jar. 
    the search field placeholder should say search by evm compatiable address
    change the jar results page to default to show the message that it shows when a user doesn't have access to any jars. this means the searchresults component won't be present until the user searches for an address that has access a jar

----
in the jar creation page:
    the jar owner card needs to have validation for the new owner address that requires them to input the address twice and verify they match and are valid evm addresses
    change the jar owner warning to say: Only the jar owner will be able to modify jar settings after the jar is created. 

in the searchresults page
    the button should be search not +create jar. The search button should allow the user to input an address then it will search through the mock data to find jars that user has access to. Please modify the mock data so I can test the search for jar functionality. 

please add more claims to the mock data so I can test the scrolling of the claimhistory component

we need to add consistent truncation expansion/collapsable capabilities. the jaroverview cards in the search results component need to have descriptions that can be expanded & collapsed



-----
please update claimhistory so it doesn't use pagination all the claims should be scrollable but only 3 should viewable at any time. EG I don't want the scrollable window to be too tall

add more mock data so claimhistory so I can test scrolling capabilities

please make the following changes in the jar creation page 
    the navigation at the top should take the user back to the landing page not the search results page
    the jar owner card should have a warning on this page that says the creator won't be able to change jar settings once the jar is created, not that they will be kicked off the page. They only will be kicked off the page when they change the jar owner from the jar admin page. 
    the accesscontrol component doesn't have a save changes button on this page because these are initialization settings that are all applied in one transaction when the jar is funded
    let's have all components nested inside the basic information component so it looks nicer


----
Please make the following changes

the addfunds component should enable the fee percentage to be entered as a numeric value instead of a slider and there should be no upper limit but it should have a 1% lower limit. 

The save button in the accesscontrol setting needs to be conditionally enabled so it only is clickable if a change has been made


the claimshistory components should only show 3 claimtransaction cards at a time &total claims should show the total # of claims eg 10 claims and the total amount of tokens claimed.

then please  create the searchresults page for somone who is connected with their wallet and has access to claimable and manageable jars

----

We need to modify all of the following components to ensure they are collapsable and show up collapsed by default:
claimhistory 
accesscontrol
withdrawalsettings
addfunds

the userlist component w/in the accesscontrol component needs to have the ability for multiple addresses to be entered at once. it should allow for comma separated and new line separated values. it should also enable csv imports and exports. the input field should be adjustable/draggable in case the user wants to see more of the info it contains. there is no need have the individual addresses show up as items that can be deleted by clicking the x or delete button on them. they can simply show up as text in a field and the user can delete addresses manually by selecting them and hitting the delete key. there should be one address per line

the following components need to have individual save buttons added for adjustment settings:
userlist (blacklist & whitelist)

the jarowner component needs to have address validation for the new address input. it will require them to enter the address twice and will validate they are exactly the same. the warning message should state they will be kicked off this page as soon as they transfer ownership and to make sure they have saved all other changes before proceeding. 


claimwindow setting in withdrawalsettings component should have an adjustable time unit. eg minutes, hours, days, months

claim history needs to be scrollable and needs to have a total claim amount persistent near the top of the component before the transactioncards show up. add more mock data so we can test the scrollability 

