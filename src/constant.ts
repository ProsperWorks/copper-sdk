export type HTTP_METHOD = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type ENTITY_TYPE = 'lead' | 'person' | 'company' | 'opportunity' | 'task' | 'project';

export const ENTITY_PATH_MAP = {
  lead: 'leads',
  person: 'people',
  company: 'companies',
  opportunity: 'opportunities',
  task: 'tasks',
  project: 'projects',
};
