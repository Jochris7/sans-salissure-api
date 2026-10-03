import { ConflictException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

// 23503 = violation de clé étrangère (ex: supprimer un service/quartier
// encore référencé par une commande) ; 23505 = violation d'unicité (ex: créer
// un prestataire avec un numéro de téléphone déjà utilisé). Sans ça, ces deux
// cas remontent une erreur Postgres brute (500) au lieu d'un message
// compréhensible pour l'admin.
const CONFLICT_CODES = new Set(['23503', '23505']);

export async function runOrConflict<T>(
  fn: () => Promise<T>,
  message: string,
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (
      err instanceof QueryFailedError &&
      CONFLICT_CODES.has((err as unknown as { code?: string }).code ?? '')
    ) {
      throw new ConflictException(message);
    }
    throw err;
  }
}
