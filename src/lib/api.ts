import { mockAuth, mockPersona, mockOptimize } from "./mockData";

function delay<T>(data: T, ms = 300): Promise<{ data: T }> {
  return new Promise((r) => setTimeout(() => r({ data }), ms));
}

export const authApi = {
  register: (username: string, password: string) =>
    delay(mockAuth.register(username, password)),
  login: (username: string, password: string) =>
    delay(mockAuth.login(username, password)),
  me: () => delay(mockAuth.me()),
};

export const personaApi = {
  list: () => delay(mockPersona.list()),
  get: (id: string) => delay(mockPersona.get(id)),
  create: (data: { title: string; description: string; platform: string }) =>
    delay(mockPersona.create(data), 600),
  delete: (id: string) => delay(mockPersona.delete(id)),
};

export const optimizeApi = {
  list: () => delay(mockOptimize.list()),
  get: (id: string) => delay(mockOptimize.get(id)),
  create: (data: { persona_id: string; original_content: string; image_urls?: string[] }) =>
    delay(mockOptimize.create(data), 800),
  generateImage: (id: string) => delay(mockOptimize.generateImage(id), 1000),
};
