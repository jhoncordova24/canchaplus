import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  if (
    !req.url.includes('/auth/login') &&
    !req.url.includes('/auth/register') &&
    localStorage.getItem('token') != null
  ) {
    //Depende de la config del server backend que aun no existe
    // const headers = req.headers.set('Authorization', localStorage.getItem('token')!);
    const headers = req.headers.set('Authorization', `Bearer ${localStorage.getItem('token')!}`);
    let reqAuth = req.clone({ headers });
    return next(reqAuth);
  }
  return next(req);
};
