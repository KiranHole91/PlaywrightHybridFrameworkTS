import { Page, Route } from '@playwright/test';

type MockOptions = {
  status?: number;
  headers?: Record<string, string>;
  method?: string; // mock only this HTTP method, let others pass through
};

/**
 * Mocks browser traffic (XHR/fetch from the UI) using page.route().
 * Does NOT intercept calls made via the APIRequestContext (request fixture).
 * Register mocks BEFORE the action that fires the request.
 */
export default class APIMockUtils {

  /** Replace the response with a fully fake JSON body */
  public async mockResponse(page: Page, urlPattern: string | RegExp, body: unknown,
    { status = 200, headers, method }: MockOptions = {}) {
          await page.route(urlPattern, async (route: Route) => {
             if (method && route.request().method() !== method.toUpperCase()) 
                    return route.fallback();
          await route.fulfill({ status, headers, json: body });
        });
  }

  /** Let the request hit the real server, then tweak its JSON response */
  public async modifyResponse<T>(page: Page, urlPattern: string | RegExp, modifier: (json: T) => T) {
              await page.route(urlPattern, async (route: Route) => {
                    const response = await route.fetch();
                    const json: T = await response.json();
                    await route.fulfill({ response, json: modifier(json) });
              });
  }

  /** Simulate an error status code */
  public async mockError(page: Page, urlPattern: string | RegExp, status = 500, body: unknown = {}) {
    await this.mockResponse(page, urlPattern, body, { status });
  }

  /** Simulate a network failure (offline, DNS failure, etc.) */
  public async abortRequest(page: Page, urlPattern: string | RegExp, errorCode = 'failed') {
    await page.route(urlPattern, (route: Route) => route.abort(errorCode));
  }

  /** Remove a mock so later requests go to the real server */
  public async removeMock(page: Page, urlPattern: string | RegExp) {
    await page.unroute(urlPattern);
  }
}
