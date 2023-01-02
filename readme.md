# Master Pieces LTD

Project built for database course in 5th semester. 

The aim of the project was to use raw PL/SQL with oracle database to develop an application for the given scenario.

## System Description

A local businesswoman has decided to start her own Internet business, called Masterpieces Ltd, hiring 
paintings to private individuals and commercial companies.

The system must be able to manage the details of customers, paintings and those paintings currently on 
hire to customers. Customers are categorized as B (bronze), S (silver), G (gold) or P (platinum). These 
categories entitle a customer to a discount of 0%, 5%, 10% or 15% respectively. 

Customers often request paintings by a particular artist or theme (eg animal, landscape, seascape, naval, 
still‐life, etc). Over time a customer may hire the same painting more than once. 

Each painting is allocated a customer monthly rental price defined by the owner. The owner of the 
painting is then paid 10% of that customer rental price. Any paintings that are not hired within six months 
are returned to the owner. However, after three months, an owner may resubmit a returned painting. 

Each painting can only have one artist associated with it. 

Several reports are required from the system. Three main ones are: 

- For each customer, a report showing an overview of all the paintings they have hired or are currently 
hiring 

- For each artist, a report of all paintings submitted for hire 

- For each artist, a returns report for those paintings not hired over the past six months 

## Requirements - How to run

To run the expresjs application:

1. Install the dependencies using ```npm install```

2. If you do not have any oracle database instance on your local computer, download and install *Oracle Database XE* using the instructions given here: [Install Oracle XE for nodejs](https://www.oracle.com/database/technologies/appdev/quickstartnodeonprem.html) 

4. Create a ```.env``` file in the root directory (same as ```server.js```) and add the following variables:
    - ```PORT = XXXX``` the port you wish to run the server on 
    - ```DB_USER = XXXX``` replace XXXX with your database user name you configured.
    - ```DB_PASS = XXXX``` replace XXXX with your database user password you configured.
    - ```DB_LINK = XXXX``` replace XXXX with your database link such as ```localhost/xepdb1``` (default for Oracle XE, can be different for other oracle databases)
    - ```INIT_TABLES = 1``` on running the project first time so tables can be created. Set to ```-1``` later.

5. Run using the command ```nodemon server.js``` or ```npm run start```