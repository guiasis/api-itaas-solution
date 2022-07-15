import { Request, Response } from 'express'
import ConvertService from './convert.service'
import { cdnToAgoraDto } from './dto/cdn-to-agora.dto'

class ConvertController {
    public async convertCDNLogsToAgoraFormat(req: Request, res: Response): Promise<Response> {
        try {
            const body = req.body
            await cdnToAgoraDto.validateAsync(body)
            const result = await ConvertService.convertCDNLogsToAgoraFormat(body)

            return res.json(result)
        }
        catch (error) {
            return res.status(500).json(error)
        }
    }
}

export default new ConvertController()