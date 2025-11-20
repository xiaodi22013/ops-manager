export enum UserRole {
  ADMIN = 'ADMIN',
  DEV = 'DEV',
  VIEWER = 'VIEWER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
}

export interface Project {
  id: string;
  name: string;
  domains: string[];
  owner: User;
  developers: User[];
  admins: User[];
  updatedAt: string;
  description?: string;
}

export enum ResourceType {
  EC2 = 'EC2',
  REDIS = 'REDIS',
  RDS = 'RDS'
}

export interface CloudResource {
  id: string;
  resourceId: string;
  name: string;
  type: ResourceType;
  status: 'running' | 'stopped' | 'terminated' | 'available';
  region: string;
  ipAddress?: string;
  spec?: string; // e.g., t3.micro
  updatedAt: string;
}

export interface MiddlewareStat {
  timestamp: string;
  cpu: number;
  memory: number;
  requests: number;
  errors: number;
}
