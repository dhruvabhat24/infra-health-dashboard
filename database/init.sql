CREATE TABLE IF NOT EXISTS sample_data (
    id SERIAL PRIMARY KEY,
    service TEXT NOT NULL,
    status TEXT NOT NULL,
    message TEXT NOT NULL
);

INSERT INTO sample_data (service, status, message) VALUES
('api', 'healthy', 'Backend can read PostgreSQL through db.internal'),
('database', 'ready', 'Seeded sample record'),
('network', 'connected', 'Frontend and backend are isolated by network boundaries');
