# Uber
Users book rides with drivers for transport.


## Functional Requirements
- Riders can get a trip estimate
- Riders can request a trip
- Drivers get assigned a trip

-- Out of scope --
- Account management
- Safety features (share location with friends)
- Scheduled trips
- Multi-vehicle drivers
- Post trip tips
- Ratings
- Ride categories (X, XL, etc.)
- Driver location history
- Tolls
- Cancel ride

## Non-Functional Requirements
- Low latency ride matching
- Driver only assigned one ride at a time
- High availability
- Demand surge

-- Out of scope --
- GDPR
- Backups
- CI/CD
- Monitoring
- Driver multi-trip optimization

## Entities
- Rider: name, contact, payment
- Driver: name, vehicle, status
- Trip: riderId, driverId, vehicleId, pickupLocation, dropoffLocation, plannedRoute, actualFare, status, pickupTimestamp, dropoffTimestamp
- Vehicle: make, model, color, capacity
- DriverLocation: driverId, lat, lon, timestamp

## Interfaces
- REST for basic logic
- Webhooks for real-time location?

## Endpoints
### Create trip estimate
- POST /trips/estimate?pickupLocation={}&dropoffLocation={}
  - RETURNS: partial trip (id, estimatedPickupTimestamp, estimatedDropoffTimestamp, estimatedPrice)
### Request trip
- PATCH /trips/request
  - BODY: tripId
### Update driver location
- PATCH /drivers/location
  - BODY: lat, lon
### Update trip status
- PATCH /trips/status
  - BODY: tripId

## High Level Design
### Riders can get a trip estimate
- SIMPLE
  - Rider Client -> API Gateway + Load Balancer -> Trip Service -> Database
  - Trip Service -> Mapping API
- TODO
  - Driver match (geospatial search)

### Riders can request a trip
- SIMPLE
  - Rider Client -> API Gateway + Load Balancer -> Trip Match Service -> Database
  - Trip Service -> Driver Client
  

# Scratchpad
## How do drivers get notified when they have a new trip?