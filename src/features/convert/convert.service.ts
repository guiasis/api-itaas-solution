import axios from 'axios'
import fs from 'fs'
import mkdirp from 'mkdirp'
import path from 'path'
import { version } from '../../../package.json'

class ConvertService {
    public async convertCDNLogsToAgoraFormat({ sourceUrl, targetUrl }) {
        this.validateSourceUrl(sourceUrl)
        this.validateTargetUrl(targetUrl)

        const file = await this.getFile(sourceUrl)
        const convertedFile = this.convertToAgora(file)

        await this.saveFile(convertedFile, targetUrl)

        return {
            convertedResult: convertedFile
        }
    }

    private validateSourceUrl(sourceUrl: string) {
        if (!/[.][^\ .]+$/g.test(sourceUrl) || !/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(sourceUrl)) {
            throw { message: "Invalid Source Url" }
        }
    }

    private validateTargetUrl(targetUrl: string) {
        if (!/[.][^\ .]+$/g.test(targetUrl)) {
            throw { message: "Invalid Targe Url" }
        }
    }

    private async getFile(sourceUrl: string): Promise<any> {
        const result = await axios({
            url: sourceUrl,
            method: 'GET',
            responseType: 'blob'
        })

        if (!result.data) {
            throw { message: "Failed to download source file" }
        }

        return result.data
    }

    private convertToAgora(file: string): any {
        const defaultText =
            `#Version: ${version}\n#Date: ${new Date().toLocaleString()}\n#Fields: provider   http - method   status - code   uri - path   time - taken   response - size   cache - status\n`

        const separedLines = file.split(/\n/g)

        const separedCharacters = separedLines.map(line => line.split(/[| ]+/)).filter(c => c.length === 7)

        const agoraFormat = separedCharacters.map(character => {
            const provider = `"MINHA CDN"`
            const httpMethod = character[3].replace(`"`, "")
            const statusCode = character[1]
            const uriPath = character[4].replace("/", "")
            const timeTaken = character[0]
            const responseSize = character[6].replace("\r", "")
            const cacheStatus = character[2] === "INVALIDATE" ? "REFRESH_HIT" : character[2]

            return `${provider} ${httpMethod} ${statusCode} / ${uriPath} ${timeTaken} ${Math.trunc(Number(responseSize))} ${cacheStatus}\t`
        }).join('\n')

        return defaultText + agoraFormat
    }

    private async saveFile(file: string, targetUrl: string) {
        await mkdirp(path.dirname(targetUrl))
        fs.writeFileSync(targetUrl, file)
    }
}

export default new ConvertService()