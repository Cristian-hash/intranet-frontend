// =====================================================================
// JwtUtil — El único lugar que sabe leer un token JWT.
// SRP: Esta clase NO inyecta servicios, NO navega, NO hace HTTP.
// Solo recibe un string (token) y extrae datos de él.
// =====================================================================

export class JwtUtil {

  /** Extrae el payload del JWT de forma segura. Retorna null si falla. */
  static parsearPayload(token: string): Record<string, unknown> | null {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  static obtenerRol(token: string): string | null {
    const payload = JwtUtil.parsearPayload(token);
    return payload ? (payload['role'] as string) ?? null : null;
  }

  static obtenerIdUsuario(token: string): number | null {
    const payload = JwtUtil.parsearPayload(token);
    if (!payload || !payload['sub']) return null;
    return Number(payload['sub']);
  }

  static estaVencido(token: string): boolean {
    const payload = JwtUtil.parsearPayload(token);
    if (!payload || !payload['exp']) return true;
    // 'exp' está en segundos. Date.now() en milisegundos, por eso dividimos.
    return (payload['exp'] as number) < Date.now() / 1000;
  }
}
