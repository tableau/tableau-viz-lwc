@isTest(isParallel=true)
public class TestTableauServerInfo {
    @isTest
    static void testGoodRequest() {
        Test.setMock(HttpCalloutMock.class, new HttpRequestMock(false, true));
        Test.startTest();
        Boolean ret = TableauServerInfo.getTableauServerInfo(
            'https://goodurl.com'
        );
        Test.stopTest();

        System.assertEquals(true, ret);
    }

    @isTest
    static void testBadRequest() {
        Test.setMock(HttpCalloutMock.class, new HttpRequestMock(false, false));
        Test.startTest();
        Boolean ret = TableauServerInfo.getTableauServerInfo(
            'https://badurl.com'
        );
        Test.stopTest();

        System.assertEquals(false, ret);
    }

    @isTest
    static void testCalloutException() {
        Test.setMock(HttpCalloutMock.class, new HttpRequestMock(true, false));
        Test.startTest();
        Boolean ret = TableauServerInfo.getTableauServerInfo(
            'https://calloutexceptionurl.com'
        );
        Test.stopTest();

        System.assertEquals(false, ret);
    }
}
