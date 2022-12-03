# RealMarket-backend
api endpoint for RealMarket project



## Available endpoints

### ``/listings GET`` 
> returns all of the listings (default limit: 20) <br>
#### **queries:** 
- limit: ( positive number ) ``?limit=4``
- sort: ( \<field\>+\<sort type\> ) ``?sort=price+ascending``
> available fields: ``price`` ``createdAt`` ``views`` <br>
> available sort types: ``ascending`` ``descending``

<hr>

### ``/listings/:id GET`` 
> returns a single listing with matching ``:id``

### ``/listings POST`` 
> post a single listing
#### **request body structure:**
> **optional fields:** ``pictures``
```json
{
  "title": "Black T-Shirt",
  "description": "Selling this size M black t-shirt",
  "pictures": ["http://link.to/picture.jpeg", "http://another.link.to/picture.jpeg"],
  "price": 20,
  "location": "Bongo, Chingo Republic"
}
```
<hr>

### ``/listings/:id PATCH`` 
> update an existing listing with a matching ``:id``
#### **request body structure:**
```json
{
  "<field to update>": "<new value>"
}
```

### ``/listings/:id DELETE`` 
> deletes a listing with matching ``:id``

