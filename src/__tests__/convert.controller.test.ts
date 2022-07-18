import { Request, Response } from 'express'
import ConvertController from "../features/convert/convert.controller"

describe('Test Convert Controller', () => {
    const controller = ConvertController
    let service
    let response

    beforeEach(() => {

        const MockConvertService = {
            convertCDNLogsToAgoraFormat: jest.fn()
        }

        const MockResponse = {
            json: jest.fn()
        }

        response = MockResponse
        service = MockConvertService
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })

    describe('convertCDNLogsToAgoraFormat', () => {
        test('should be a valid body', async () => {
            const mockRequest = <Request>{
                body: {
                    sourceUrl: "https://s3.amazonaws.com/uux-itaas-static/minha-cdn-logs/input-01.txt",
                    targetUrl: "./output/minhaCdn1.txt"
                }
            }

            jest.spyOn(service, 'convertCDNLogsToAgoraFormat').mockImplementation(() => "OK")
            jest.spyOn(response, 'json').mockImplementation(() => "OK")

            const result = await controller.convertCDNLogsToAgoraFormat(mockRequest, response)

            expect(result).toBe("OK")
        })

        test('should be a invalid body', async () => {
            const mockRequest = <Request>{
                body: {
                    sourceUrl: 1234,
                    targetUrl: "./output/minhaCdn1.txt"
                }
            }

            await expect(async () => { await controller.convertCDNLogsToAgoraFormat(mockRequest, response) }).rejects.toThrow()
        })
    })
})