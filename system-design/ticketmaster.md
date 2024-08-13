# Ticket master
Users book tickets to events to see performers.

## Approach
Requriements -> Entities -> Interface/Endpoints -> High Level Design -> Deep Dives

## Requirements
- View events
- Book tickets to events
- Search for events

--- Out of scope ---
- Account management
- Event management
- View performers, venues, tickets
- Event subtypes (e.g. concert, comedy show)

## Entities
- User
- Event
- Venue
- Performer
- Ticket
- Booking

## Interface
- REST vs GraphQL vs Wire (SSE/Websockets)
  - REST for simplicity
  - Don't need custom data fetch queries from frontend (No GraphQl)
  - Don't see need for complex interfaces yet (No Wire)

## Endpoints
- GET /events/:eventId
- POST /bookings/:eventId
  - ticketIds
  - paymentInfo
- GET /events?searchText={}&venueId={}&performerId={}&lat={}&lon={}&radius={}

## High Level Design
### View events
- SIMPLE: Client -> API Gateway -> Events Service -> Database
- TODO: Event read performance (distributed cache, horizontal scaling + load balancing)

### Search for events
- SIMPLE: Client -> API Gateway -> Search -> Database
- TODO: Search performance (full-text search, geospatial search, query result caching)

### Book tickets to events
- SIMPLE: Client -> API Gateway -> Booking Service -> Database, Payment Provider
- TODO: No double bookings (distributed locks, transactions), Popular events (waiting queues)

## Deep Dives
### Event read performance
- Distributed cache
  - Architecture: events service -> redis
  - Rationale: read >> write (event details change infrequently)
  - Key: { eventId: eventData }
  - Write strategy: write-around (direct to db, update cache on read if not exists) 
  - Invalidation
    - SIMPLE: 1 hour TTL
    - COMPLEX: Invalidate on event update from db trigger
- Horizontal scaling + load balancing
  - Architecture: load balancer evenly distributes requests across server instances
  - Rationale: events service is stateless
  - Load balancer algorithm: round robin or least connections

### Search performance
- Full-text search
  - Architecture: Database CDC (change-data-capture) -> elastic search
    - Note: could also setup full-text indexes in postgres
  - Implementation: Define text mappings in ES, utilize fuzzy search
  - Under-the-hood: Apache Lucene + inverted indexes + tokens + stemming
- Geospatial search
  - Architecture: Also rely on elastic search
    - Note: could also setup geospatial indexes in postgres w/PostGIS but dont need complex geospatial queries (joins, neighbors, shape manipulations e.g. intersects/unions), or ACID compliance -- read performance and scalability better with ES
  - Implementation: Define geopoint mappings in ES, utilize proximity search -- can be coupled with full-text search
- Query result caching
  - Architecture: elastic search has built-ins for this w/LRU cache
    - Note: could also utilize CDNs for geographical search caching
    - Gotcha: Proximity search would need to be extended to map to specific regions

### No double bookings
- Distributed locks
  - Architecture: booking services -> redis
  - Strategy: lock tickets to userId with TTL (10 min)
  - Gotcha: multiple tickets -- either lock all or release all acquired if any locked
- Transactions
  - Update all ticket statuses + booking in the same transaction

## Popular events
- Waiting queue
  - Architecture: 
    - Users pushed onto FIFO queue to wait to view booking page
    - Dequeue users after tickets booked or ticket lock expires
    - Notify clients via websockets they gained a booking seat / provide estimated wait times
