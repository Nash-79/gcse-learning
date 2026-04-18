const unauthorizedHeaders = {
  "Content-Type": "application/json",
};

interface AuthUser {
  id: string;
  email?: string;
}

function unauthorized(message: string, status = 401): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: unauthorizedHeaders,
  });
}

export async function requireAuthenticatedUser(req: Request): Promise<AuthUser | Response> {
  const authHeader = req.headers.get("Authorization") ?? req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return unauthorized("Missing authorization header");
  }

  const token = authHeader.slice("Bearer ".length).trim();
  if (!token) {
    return unauthorized("Missing bearer token");
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey =
    Deno.env.get("SUPABASE_ANON_KEY") ??
    Deno.env.get("SUPABASE_PUBLISHABLE_KEY");

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Function auth misconfigured: missing Supabase runtime env");
    return unauthorized("Function auth is not configured", 500);
  }

  const authResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
    method: "GET",
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!authResponse.ok) {
    return unauthorized("Invalid or expired session");
  }

  const user = (await authResponse.json()) as AuthUser;
  if (!user?.id) {
    return unauthorized("Invalid user session");
  }

  return user;
}
