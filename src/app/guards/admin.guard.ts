import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { showToast } from '../tools/message-routines';

export const adminGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    // Verifica el usuario autenticado
    const usuario = await authService.leerUsuarioAutenticado();

    // Si el usuario es admin, permite el acceso
    if (usuario?.cuenta === 'admin') {
      return true;
    }

    // Si no es admin, deniega el acceso y redirige
    await showToast('Acceso denegado: Solo los administradores pueden acceder.');
    await router.navigate(['/inicio']); // Redirigir a una página segura
    return false;
  } catch (error) {
    console.error('Error en adminGuard:', error);
    await router.navigate(['/inicio']); // Redirigir en caso de error
    return false;
  }
};
