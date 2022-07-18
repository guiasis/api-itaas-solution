import ConvertService from '../features/convert/convert.service'

describe('Test Convert Controller', () => {
    const service = ConvertService
    let mockService

    const validGetFile = `312 | 200 | HIT |"GET /robots.txt HTTP/1.1"| 100.2\r\n101 | 200 | MISS |"POST / myImages HTTP / 1.1"|319.4\r\n199|404|MISS|"GET /not-found HTTP/1.1"|142.9\r\n312|200|INVALIDATE|"GET /robots.txt HTTP/1.1" | 245.1\r\n`
    const validAgoraFormat = `#Version: 1.0.0\n#Date: ${new Date().toLocaleString()}\n#Fields: provider   http - method   status - code   uri - path   time - taken   response - size   cache - status\n"MINHA CDN" GET 200 / robots.txt 312 100 HIT\t\n"MINHA CDN" POST 200 / myImages 101 319 MISS\t\n"MINHA CDN" GET 404 / not-found 199 142 MISS\t\n"MINHA CDN" GET 200 / robots.txt 312 245 REFRESH_HIT\t`
    const validBody = {
        sourceUrl: "https://s3.amazonaws.com/uux-itaas-static/minha-cdn-logs/input-01.txt",
        targetUrl: "./output/minhaCdn1.txt"
    }

    beforeEach(() => {

        const MockConvertService = {
            getFile: jest.fn(),
            saveFile: jest.fn()
        }

        mockService = MockConvertService
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('convertCDNLogsToAgoraFormat', () => {
        test('should be a valid body', async () => {
            jest.spyOn(mockService, "getFile").mockImplementation(() => validGetFile)
            jest.spyOn(mockService, "saveFile").mockImplementation(() => true)

            const result = await service.convertCDNLogsToAgoraFormat(validBody)

            expect(result).toBe("OK")
        })

        test('should be a invalid sourceUrl', async () => {
            const invalidSourceUrl = {
                sourceUrl: "1234",
                targetUrl: "./output/minhaCdn1.txt"
            }

            await expect(async () => {
                await service.convertCDNLogsToAgoraFormat(invalidSourceUrl)
            }).rejects.toThrow()
        })

        test('should be a invalid targetUrl', async () => {
            const invalidTargetUrl = {
                sourceUrl: "https://s3.amazonaws.com/uux-itaas-static/minha-cdn-logs/input-01.txt",
                targetUrl: "1234"
            }
            await expect(async () => {
                await service.convertCDNLogsToAgoraFormat(invalidTargetUrl)
            }).rejects.toThrow()
        })
    })
})