if a page ever has the jar header component assume that all other components are nested w/in that component unless otherwise stated

ensure consistent naming of components - remove card from the name unless specified otherwise. eg: jarownercard should be jarowner

emphasize that the jar creation page the only settings that show up as form fields are:   - Initial funding amount (optional)  - Jar title  - Jar description - Jar token selection (with tooltip). all other settigns are contained w/in the mentioned components

the current version won't have any integration w/ providers like infura. we will exclude this functionality for now or make mock data if it's necessar to imitate providers(it's usually not necessary)

be very explicit about components that will contain other components eg claim history component contains claimtransaction component

be very clear that the addfunds component needs the ability to input how much in total will be sent to the jar (at least 1% will go to fees so only 99% will go to jar) OR how much in total will go to the jar. This is important if users care about how much in total goes into the jar vs how much in total they add. EG they want 100 tokens in the jar they would set 100 tokens to jar then it would automatically calculate they need to send ~101.01 tokens to the jar and only 100 of them would go in because the rest are going to the fees. They also need to be able to adjust the fee amount and should be able to change it form 1% all the way up to 100%

emphasize important details like the claim reason must be at least 20 characters


