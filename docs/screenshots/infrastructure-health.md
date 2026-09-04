# Test 01 — Infrastructure Health

## 1. What Is This Test?

The Infrastructure Health test verifies that all services required by the **Infra Health Dashboard** are successfully running after the Docker Compose stack is deployed.

The project consists of multiple interconnected services, including:

- Frontend
- Load Balancer
- Backend 1
- Backend 2
- PostgreSQL Database
- DNS / dnsmasq
- Metrics API
- Prometheus
- Blackbox Exporter
- cAdvisor

This test establishes the initial health baseline of the complete infrastructure before performing application, networking, monitoring, and failure tests.

---

## 2. Why Does This Test Matter?

A distributed application depends on multiple services working together.

If one of the infrastructure components is stopped, unhealthy, or incorrectly configured, later tests may produce misleading results.

Therefore, the first step in validating a deployment is to confirm that the complete service stack is operational.

This is important in real DevOps environments because infrastructure validation helps engineers:

- Confirm that a deployment completed successfully
- Detect failed or unhealthy containers
- Verify Docker health checks
- Establish a known-good baseline
- Troubleshoot failures before investigating higher-level application problems

This test also demonstrates the use of **Docker Compose service health checks** as part of infrastructure validation.

---

## 3. Test Objective

The objective of this test is to verify that all services in the Infra Health Dashboard stack are running and that services with configured health checks report a healthy state.

### Expected condition

**10/10 services should be running.**

Services with Docker health checks should report:

`Up (healthy)`

Services without an explicit Docker health check should report:

`Up`

---

## 4. Test Environment

The test is performed locally using:

- Windows 11
- WSL2
- Docker Desktop
- Docker Compose

Project:

**Infra Health Dashboard**

The Docker Compose stack contains the following services:

| Service | Purpose |
|---|---|
| `frontend` | React dashboard served through NGINX |
| `loadbalancer` | NGINX reverse proxy/load balancer |
| `backend1` | First Flask backend |
| `backend2` | Second Flask backend |
| `database` | PostgreSQL database |
| `dns` | dnsmasq internal DNS service |
| `metrics-api` | Aggregates monitoring and traffic information |
| `prometheus` | Metrics collection and monitoring |
| `blackbox-exporter` | Endpoint health monitoring |
| `cadvisor` | Container resource monitoring |

---

## 5. Steps to Conduct the Test

Navigate to the project directory:

    cd ~/projects/infra-health-dashboard

Run:

    docker compose ps

The `docker compose ps` command displays the current state of all containers managed by the project.

Check the `STATUS` column for every service.

---

## 6. Expected Result

The test passes when:

1. All 10 services are listed.
2. No service is in a `Created`, `Exited`, or `Restarting` state.
3. Services with health checks report `Up (healthy)`.
4. Services without explicit health checks report `Up`.

A successful deployment should therefore show the complete infrastructure stack running simultaneously.

---

## 7. Test Evidence

The following screenshot shows the output of `docker compose ps` after deployment.

![Infrastructure Health Test](<img width="1892" height="527" alt="Infra Health" src="https://github.com/user-attachments/assets/4324f2c0-d972-40e5-9b6d-52943ffaf775" />
)

---

## 8. Actual Test Output

The `docker compose ps` command was executed from the project directory.

The output showed all 10 required services running:

| Service | Observed Status |
|---|---|
| `backend1` | Up — Healthy |
| `backend2` | Up — Healthy |
| `blackbox-exporter` | Up |
| `cadvisor` | Up — Healthy |
| `database` | Up — Healthy |
| `dns` | Up — Healthy |
| `frontend` | Up — Healthy |
| `loadbalancer` | Up — Healthy |
| `metrics-api` | Up — Healthy |
| `prometheus` | Up |

The Docker Compose output also confirms that the expected service ports are exposed inside the Docker environment, with the externally accessible application services showing their configured host mappings.

---

## 9. Output Explanation

### Backend 1 and Backend 2

Both backend services are running and report a healthy status.

This confirms that the two Flask application instances required for load balancing are operational.

The services expose port `5000` inside the Docker network.

---

### Database

The PostgreSQL database is running and reports a healthy status.

The database exposes PostgreSQL on port `5432` and also has its internal health endpoint available on port `8080`.

This confirms that the database component is operational before database connectivity tests are performed.

---

### DNS

The DNS service is running and reports a healthy status.

This service provides the internal DNS resolution required by the backend containers, including the `db.internal` hostname used to reach PostgreSQL.

The DNS functionality will be validated separately in the DNS testing phase.

---

### Frontend

The frontend container is running and reports a healthy status.

It publishes the dashboard through:

`localhost:3000`

This confirms that the user-facing dashboard infrastructure is available.

---

### Load Balancer

The load balancer is running and reports a healthy status.

It publishes port `8080` to the host:

`localhost:8080`

This service is responsible for distributing requests between Backend 1 and Backend 2.

Its routing and backend failure behavior will be tested separately.

---

### Metrics API

The Metrics API is running and reports a healthy status.

It provides the API used by the dashboard to retrieve:

- Backend traffic
- Service health information
- Prometheus-derived metrics

Its monitoring functionality will be validated in later tests.

---

### Prometheus

Prometheus is running successfully.

It is responsible for collecting metrics from the infrastructure and application services.

Prometheus itself does not show `(healthy)` in this output because the Compose configuration does not define a Docker health check for the Prometheus container.

Prometheus target health will therefore be validated separately.

---

### Blackbox Exporter

The Blackbox Exporter is running successfully.

It is used to perform endpoint-level health probing against the services in the infrastructure.

Its monitored targets will be validated during the monitoring tests.

---

### cAdvisor

cAdvisor is running and reports a healthy status.

It provides container-level resource metrics such as CPU and network statistics for Prometheus.

---

## 10. Test Result

### PASS

The infrastructure health test successfully passed.

All **10 required Docker Compose services are running**, and every service with a configured Docker health check is reporting a healthy state.

This establishes a valid baseline for the remaining Infra Health Dashboard tests.

---

## 11. DevOps Relevance

This test demonstrates a fundamental DevOps practice:

> **Validate infrastructure health before validating application behavior.**

In a production environment, the same principle can be applied through:

- Container health checks
- Kubernetes readiness and liveness probes
- CI/CD deployment validation
- Infrastructure monitoring
- Automated smoke tests
- Service dependency checks

The test provides confidence that the underlying infrastructure is operational before proceeding with more detailed functional and failure testing.

---
