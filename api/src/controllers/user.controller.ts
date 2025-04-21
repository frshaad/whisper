import type { Request, Response } from 'express'

import { AppError, handleError } from '@/lib/errors'
import { updateUserInfoSchema } from '@/lib/zod-schemas/user.zod'
import { updateUserInfoService } from '@/services/user.service'

export async function updateUserInfo(req: Request, res: Response) {
  try {
    const parsedInputs = updateUserInfoSchema.parse(req.body)
    const userId = req.userId
    if (!userId) {
      throw new AppError(404, 'Access denied. User not found.')
    }

    const user = await updateUserInfoService(parsedInputs, userId)

    res.status(200).json({ success: true, data: user })
  } catch (error) {
    handleError(error, res)
  }
}
