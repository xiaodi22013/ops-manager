import { Project, User, UserRole, CloudResource, ResourceType, MiddlewareStat } from '../types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alice Ops', email: 'alice@example.com', avatar: 'https://picsum.photos/seed/alice/32/32', role: UserRole.ADMIN },
  { id: 'u2', name: 'Bob Dev', email: 'bob@example.com', avatar: 'https://picsum.photos/seed/bob/32/32', role: UserRole.DEV },
  { id: 'u3', name: 'Charlie Manager', email: 'charlie@example.com', avatar: 'https://picsum.photos/seed/charlie/32/32', role: UserRole.ADMIN },
  { id: 'u4', name: 'Dave Coder', email: 'dave@example.com', avatar: 'https://picsum.photos/seed/dave/32/32', role: UserRole.DEV },
  { id: 'u5', name: 'Eve Monitor', email: 'eve@example.com', avatar: 'https://picsum.photos/seed/eve/32/32', role: UserRole.VIEWER },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'P-1001',
    name: 'E-Commerce Core',
    domains: ['shop.example.com', 'api.shop.example.com', 'admin.shop.example.com', 'cdn.shop.example.com'],
    owner: MOCK_USERS[0],
    developers: [MOCK_USERS[1], MOCK_USERS[3]],
    admins: [MOCK_USERS[0], MOCK_USERS[2]],
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    description: 'Main monolith for the online store.'
  },
  {
    id: 'P-1002',
    name: 'Payment Gateway Service',
    domains: ['pay.example.com'],
    owner: MOCK_USERS[2],
    developers: [MOCK_USERS[1]],
    admins: [MOCK_USERS[2]],
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    description: 'Microservice handling stripe integrations.'
  },
  {
    id: 'P-1003',
    name: 'Logistics Tracker',
    domains: ['track.example.com', 'driver.example.com'],
    owner: MOCK_USERS[0],
    developers: [MOCK_USERS[3]],
    admins: [MOCK_USERS[0]],
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  }
];

export const MOCK_CLOUD_RESOURCES: CloudResource[] = [
  { id: 'c1', resourceId: 'i-0a1b2c3d4e5f', name: 'web-server-01', type: ResourceType.EC2, status: 'running', region: 'us-east-1', spec: 't3.medium', ipAddress: '10.0.1.5', updatedAt: new Date().toISOString() },
  { id: 'c2', resourceId: 'i-1a2b3c4d5e6f', name: 'worker-node-01', type: ResourceType.EC2, status: 'stopped', region: 'us-east-1', spec: 'm5.large', ipAddress: '10.0.2.10', updatedAt: new Date().toISOString() },
  { id: 'c3', resourceId: 'redis-cache-primary', name: 'Session Cache', type: ResourceType.REDIS, status: 'available', region: 'us-east-1', spec: 'cache.t3.micro', updatedAt: new Date().toISOString() },
  { id: 'c4', resourceId: 'db-prod-primary', name: 'Production DB', type: ResourceType.RDS, status: 'available', region: 'us-east-1', spec: 'db.r5.large', updatedAt: new Date().toISOString() },
  { id: 'c5', resourceId: 'db-prod-replica', name: 'Read Replica 1', type: ResourceType.RDS, status: 'available', region: 'us-east-1', spec: 'db.r5.large', updatedAt: new Date().toISOString() },
];

export const generateMiddlewareStats = (): MiddlewareStat[] => {
  const stats: MiddlewareStat[] = [];
  const now = Date.now();
  for (let i = 0; i < 24; i++) {
    stats.push({
      timestamp: new Date(now - i * 3600 * 1000).toISOString(), // Last 24 hours
      cpu: Math.floor(Math.random() * 60) + 10,
      memory: Math.floor(Math.random() * 40) + 20,
      requests: Math.floor(Math.random() * 1000) + 100,
      errors: Math.floor(Math.random() * 10),
    });
  }
  return stats.reverse();
};