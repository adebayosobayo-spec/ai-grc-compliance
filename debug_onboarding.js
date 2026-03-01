import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Listen to console and network
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));
    page.on('response', async response => {
        if (response.url().includes('/api/v1/compliance/onboarding')) {
            console.log('RESPONSE STATUS:', response.status());
            try {
                const body = await response.text();
                console.log('RESPONSE BODY:', body);
            } catch (e) {
                console.log('Could not read response body');
            }
        }
    });

    console.log('Navigating to local site...');
    await page.goto('http://localhost:5173/onboarding', { waitUntil: 'networkidle2' });

    // Fill required step 1 forms
    await page.type('input[name="organization_name"]', 'Test Org');
    await page.select('select[name="industry"]', 'Technology / Software');
    await page.select('select[name="employee_count"]', '1–50');
    // Framework is preselected to ISO 27001

    console.log('Clicking Next on Step 1...');
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(500);

    // Step 2
    console.log('Clicking Next on Step 2...');
    await page.evaluate(() => {
        document.querySelector('input[name="has_security_policy"][value="yes"]').click();
        document.querySelector('input[name="has_security_team"][value="no"]').click();
        document.querySelector('input[name="performs_risk_assessments"][value="partial"]').click();
        document.querySelector('input[name="has_incident_response"][value="yes"]').click();
        document.querySelector('input[name="has_business_continuity"][value="yes"]').click();
    });
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(500);

    // Step 3
    console.log('Clicking Next on Step 3...');
    await page.evaluate(() => {
        document.querySelector('input[name="infrastructure_type"][value="cloud"]').click();
        document.querySelector('input[name="has_third_party_vendors"][value="yes"]').click();
        document.querySelector('input[name="has_remote_workers"][value="yes"]').click();
        document.querySelector('input[name="has_asset_inventory"][value="yes"]').click();
        document.querySelector('input[name="uses_identity_management"][value="yes"]').click();
    });
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(500);

    // Step 4
    console.log('Clicking Next on Step 4...');
    await page.evaluate(() => {
        document.querySelector('input[name="risk_appetite"][value="medium"]').click();
    });
    await page.select('select[name="compliance_timeline"]', '6 months');
    await page.evaluate(() => {
        document.querySelector('input[name="budget_level"][value="moderate"]').click();
    });

    // Set a dummy captcha token so validation passes
    await page.evaluate(() => {
        window.setCaptchaToken = () => { };
    });

    // Simulate clicking complete since turnstile is mocked in the browser context
    console.log('Submitting form...');
    await page.evaluate(() => {
        // Find the complete button and click it
        const buttons = Array.from(document.querySelectorAll('button'));
        const completeBtn = buttons.find(b => b.textContent.includes('Complete Onboarding'));
        if (completeBtn) completeBtn.click();
    });

    await page.waitForTimeout(2000);
    await browser.close();
    console.log('Done.');
})();
