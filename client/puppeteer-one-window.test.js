const puppeteer = require('puppeteer')

jest.setTimeout(30000)

describe('Test with Puppeteer. Test text input.', () => {
    let page
    let browser
    try {
        beforeAll(async () => {
            try {
                browser = await puppeteer.launch({
                    executablePath: '/usr/bin/chromium-browser',
                    headless: true,
                    args: [
                        '--disable-gpu',
                        '--disable-dev-shm-usage',
                        '--disable-setuid-sandbox',
                        '--no-first-run',
                        '--no-sandbox',
                        '--no-zygote',
                        '--single-process',
                    ]
                })

                page = await browser.newPage()
                await page.goto('http://localhost:8080', { waitUntil: 'domcontentloaded' })
                // await page.goto(ENV_LOCAL, { waitUntil: 'domcontentloaded' })
                await page.screenshot({ path: 'screenshot.png', fullPage: true })

            } catch (error) {
                console.log('error:',error )
                
                browser = await puppeteer.launch()
                page = await browser.newPage()
                await page.goto(ENV_LOCAL, { waitUntil: 'domcontentloaded' })
            }

        })

        afterAll(async () => {
            await browser.close()
        })

        it('should contain "Required" and "Please enter at least 6 chars" only after clicking a submit with empty fields', async () => {
            await expect(await page.evaluate(() =>
                document.body.textContent.includes('Required')))
                .toBeFalsy()
            await expect(await page.evaluate(() =>
                document.body.textContent.includes('Required')))
                .toBeFalsy()

            await page.click('button[type="submit"]')

            await expect(await page.evaluate(() =>
                document.body.textContent.includes('Required')))
                .toBeTruthy()
            await expect(await page.evaluate(() =>
                document.body.textContent.includes('Please enter at least 6 chars')))
                .toBeTruthy()
            await page.screenshot({ path: 'screenshot.png', fullPage: true })

        })


    } catch (error) {
        console.log('err!: ' + error)
        return
    }
}

)