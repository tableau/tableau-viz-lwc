public class TableauServerInfo {
    @AuraEnabled
    public static Boolean getTableauServerInfo(String url) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint(url);
        req.setMethod('GET');

        HTTP http = new HTTP();
        try {
            HTTPResponse res = http.send(req);
            return res.getStatusCode() == 200;
        } catch (Exception e) {
            System.debug('Exception: ' + e.getMessage());
            return false;
        }
    }
}
