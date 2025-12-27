export function useAuth() {
  return {
    user: {
      id: "public_user",
      name: "Ciudadano",
      email: "publico@medellin.gov.co",
      role: "user",
    },
    isAuthenticated: true,
    logout: () => { },
  };
}
