import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';


export const authGuard: CanActivateFn = () => {



  return true;
};
