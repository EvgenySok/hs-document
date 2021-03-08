const puppeteer = require('puppeteer')

jest.setTimeout(30000)

describe('Test with Puppeteer. Test text input.', () => {
    let pages
    let browser
    const fieldsSelectors = ['#text', '#header', '#select', '#date']

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
                pages = await createObjectWithPages(browser, 2)
                for (const selector of fieldsSelectors) {
                    const input = await pages[0].$(selector);
                    await input.click({ clickCount: 3 })
                    await pages[0].keyboard.press('Backspace')        
                }
            } catch (error) {
                console.log('error:', error)
            }
        })

        afterAll(async () => {
            await browser.close()
        })

        it('should contain h1 "Creating a HS document" ', async () => {
            await expect(await pages[0].$eval('h1', el => el.textContent))
                .toBe("Creating a HS document")
            await expect(await pages[1].$eval('h1', el => el.textContent))
                .toBe("Creating a HS document")
        })


        it('should be "На дворе трава, на траве дрова. Не руби дрова на траве двора." in text input on each page and ather filds should be "" ', async () => {
            const value = "На дворе трава, на траве дрова. Не руби дрова на траве двора."
            await pages[0].type('#text', value, { delay: 10 })
            const getFieldsValues = async (pageNumber) => await Promise.all(fieldsSelectors.map(async selector => await pages[pageNumber].$eval(selector, el => el.value)))
            await expect(await getFieldsValues(0))
                .toEqual(await getFieldsValues(1))
        })

        it('should be "На дворе трава, на траве дрова. Не руби дрова на траве двора." in text input on each page and ather filds should be "" ', async () => {
            const value = "На дворе трава, на траве дрова. $Не руби дрова на траве двора."
            const delay = ms => new Promise(r => setTimeout(r, ms))
            const printSpeed = 600
            const [str1, str2] = value.split('$')
            console.log('str1:',str1 )
            
            await pages[0].click('#header')
            await pages[1].click('#header')
            await Promise.all([
                pages[0].keyboard.type(str2, { delay: printSpeed }),
                delay(printSpeed / 2).then(() => pages[1].keyboard.type(str1, { delay: printSpeed }))
            ])

            await pages[1].screenshot({ path: 'screenshot.png', fullPage: true })

            const getFieldsValues = async (pageNumber) => await Promise.all(fieldsSelectors.map(async selector => await pages[pageNumber].$eval(selector, el => el.value)))
            await expect(await getFieldsValues(0))
                .toEqual(await getFieldsValues(1))
        })




    } catch (error) {
        console.log('err!: ' + error)
        return
    }
}

)

async function createObjectWithPages(browser, number) {
    let pages = new Array(number).fill(undefined)
    for (let [i, el] of pages.entries()) {
        const page = await browser.newPage()
        await page.goto('http://localhost:8080', { waitUntil: 'domcontentloaded' })

        await page.focus('#email')
        await page.keyboard.type('w@e1.ru')

        await page.focus('#password')
        await page.keyboard.type('123456')

        await page.click('button[type="submit"]')
        await page.waitForSelector('li')
        pages[i] = page
    }
    return pages
}

async function clearInput(page, selector) {
    const input = await page.$(selector);
    await input.click({ clickCount: 3 })
    await input.type('')
}