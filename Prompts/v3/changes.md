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

