import type { Request, Response } from 'express'

export async function logIn(req: Request, res: Response) {
  res.send('Login Route')
}

export async function signUp(req: Request, res: Response) {
  res.send('Login Route')
}

export async function logOut(req: Request, res: Response) {
  res.send('Login Route')
}
