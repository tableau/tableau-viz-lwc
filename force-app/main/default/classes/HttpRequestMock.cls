@isTest
public class HttpRequestMock implements HttpCalloutMock {
    private Boolean shouldThrow;
    private Boolean isSuccessful;

    public HttpRequestMock(Boolean shouldThrow, Boolean isSuccessful) {
        this.shouldThrow = shouldThrow;
        this.isSuccessful = isSuccessful;
    }

    public HTTPResponse respond(HTTPRequest req) {
        HttpResponse resp = new HttpResponse();
        if (this.shouldThrow) {
            CalloutException e = new CalloutException();
            e.setMessage(
                'Unauthorized endpoint, please check Setup->Security->Remote site settings. endpoint = ' +
                req.getEndpoint()
            );
            throw e;
        } else {
            if (this.isSuccessful) {
                resp.setStatusCode(200);
                resp.setStatus('OK');
            } else {
                resp.setStatusCode(404);
                resp.setStatus('Not Found');
            }
        }
        return resp;
    }
}
