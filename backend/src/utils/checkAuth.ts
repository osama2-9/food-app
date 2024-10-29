import { Request, Response, NextFunction } from "express"
const checkAuth = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const isCookieAviable = req.cookies.auth
    if (!isCookieAviable) {
        return res.status(401).json({
            error: "Unauthorizrd"
        })


    }
    
    next()

}
export { checkAuth }