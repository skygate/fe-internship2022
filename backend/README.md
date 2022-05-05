TO START: NPM RUN DEV

auctions endpoint: /auctions (with queries)
GET:
/auctions => all auctions
/auctions/?full=true => all auctions with info about product
/auctions/?full=true&id=62726815591b057d3ae115ad => auction for defined ID with product info
/auctions/?id=62726815591b057d3ae115ad => auction for defined ID without product info

POST:
/auctions with body:
{
"userID": "user_2",
"amount": 1,
"productID": "627230b0dcab962b192e0a0a",
"duration": 24,
"price": 15
} =====> adding new auction
/auctions/6272683e591b057d3ae115af(auctionID)/bid with body:
{
"userID": "user_112",
"offer": 15
} =====> placing bid

PATCH:
/auctions/6272683e591b057d3ae115af(auctionID) with body:
{
new price:
longerDuration(hours to add):
price:
amount:
likes:
} YOU MUST NOT ADD EVERY PROPERTY => edit auction

DELETE:
/auctions/6273b3e22147a4f9ba224b75(auctionID) ==> delete auction
