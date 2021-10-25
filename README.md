# Serices
The app consits of multiple serices including backend services and client using next.js
- **auth** authentication for clients
- **expiration** expires tickets
- **orders** user order management
- **payments** payment issuing service
- **tickets** tickets issues services

## Tooling 
The app leverages dcoker and k8s service to start up services on a cluster. infra directory contains setup for each services. Skaffold is leveraged to start up all the services and sync changes in dev env

## Start up

- Install skaffold on your machine (https://skaffold.dev/docs/install/)
- Install docker client 

```
run skaffold dev
```
